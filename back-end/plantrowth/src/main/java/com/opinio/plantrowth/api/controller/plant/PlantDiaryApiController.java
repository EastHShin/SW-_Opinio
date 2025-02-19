package com.opinio.plantrowth.api.controller.plant;

import java.nio.charset.Charset;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.opinio.plantrowth.api.dto.Message;
import com.opinio.plantrowth.api.dto.diary.CreateDiaryDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryLookUpDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryResponseDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryResult;
import com.opinio.plantrowth.domain.payment.PointSpendType;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.plant.PlantDiary;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import com.opinio.plantrowth.service.plant.DiaryService;
import com.opinio.plantrowth.service.plant.PlantExpService;
import com.opinio.plantrowth.service.plant.PlantService;
import com.opinio.plantrowth.service.user.UserPointService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PlantDiaryApiController {

    private final FileUploadService fileUploadService;
    private final DiaryService diaryService;
    private final PlantService plantService;
    private final UserPointService userPointService;
    private final PlantExpService plantExpService;
    private final String filePath = "diary";

    @GetMapping("/api/plants/diary/{plant-id}/all")
    public ResponseEntity<DiaryResult> diaries(@PathVariable("plant-id") Long id){
        List<PlantDiary> findDiaries = diaryService.findDiariesByPlantId(id);
        List<DiaryDTO> collect = findDiaries.stream()
                .map(m -> new DiaryDTO(m.getTitle(), m.getContent(), m.getDate(),m.getFilename(), m.getId()))
                .collect(Collectors.toList());

        return new ResponseEntity<DiaryResult>(new DiaryResult(collect), HttpStatus.OK);
    }

    @PostMapping(value = "/api/plants/diary/{plant-id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createDiary(
            @PathVariable("plant-id") Long plantId,
            @ModelAttribute CreateDiaryDTO dto,
            @RequestPart(name = "file_name", required = false) Optional<MultipartFile> file){

        PlantDiary diary = PlantDiary.builder()
                .title(dto.getTitle())
                .date(LocalDate.now())
                .content(dto.getContent())
                .build();
        Plant plant = plantService.findOnePlant(plantId);
        diary.setPlant(plant);

        if(file.isPresent()) {
            String uploadImageName = fileUploadService.uploadImage(file.get(), filePath);
            diary.setFilename(uploadImageName);
        }
        Long result = diaryService.createDiary(diary);
        Integer curLevel = plant.getPlantLevel();
        plantExpService.increaseExp(plant.getId());
        Integer updatedLevel = plant.getPlantLevel();
        Boolean isLevelUp = false;
        if (curLevel < updatedLevel) {
            isLevelUp = true;
        }
        User user = userPointService.increasePoint(plant.getUser().getId(), PointSpendType.DIARY);
        Plant updatedPlant = plantService.findOnePlant(plant.getId());

        DiaryResponseDTO responseDTO = new DiaryResponseDTO();
        responseDTO.setPlantExp(updatedPlant.getPlantExp());
        responseDTO.setPoint(user.getPoint());
        responseDTO.setPlant_level(updatedPlant.getPlantLevel());
        responseDTO.setIsLevelUp(isLevelUp);

        Message message= new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("식물 일기 생성 완료");
        message.setData(responseDTO);

        return result !=null?
                new ResponseEntity<>(message, headers, HttpStatus.OK):
                ResponseEntity.badRequest().build();
    }

    @GetMapping("/api/plants/diary/{diary-id}")
    public ResponseEntity<?> lookUpDiary(@PathVariable("diary-id") Long id){
        DiaryLookUpDTO diary = diaryService.LookupDiary(id);
        Message message= new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("식물일기 조회 성공");
        message.setData(diary);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @PutMapping("/api/plants/diary/{diary-id}")
    public ResponseEntity<?> updateDiary(@PathVariable("diary-id") Long id,
                                         @ModelAttribute CreateDiaryDTO dto,
                                         @RequestPart(name = "file_name", required = false) Optional<MultipartFile> file){
        Long updatedId = diaryService.updateDiary(id, dto);
        Boolean isFileDelete = dto.getFile_delete();
        if (isFileDelete) {
            diaryService.updateImage(updatedId, null);
        }
        if(file.isPresent()) {
            String uploadImageName = fileUploadService.uploadImage(file.get(), filePath);
            diaryService.updateImage(updatedId, uploadImageName);
        }
        PlantDiary diary = diaryService.findDiary(updatedId);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("식물일기가 수정되었습니다.");
        message.setData(diary);
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @DeleteMapping("/api/plants/diary/{diary-id}")
    public ResponseEntity<?> deleteDiary(@PathVariable("diary-id") Long id){
        Long result = diaryService.deleteDiary(id);
        return result !=null?
                ResponseEntity.ok().body("식물 일기 삭제 완료"):
                ResponseEntity.badRequest().build();
    }


}

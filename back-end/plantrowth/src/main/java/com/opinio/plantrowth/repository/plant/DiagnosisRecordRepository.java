package com.opinio.plantrowth.repository.plant;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.opinio.plantrowth.domain.plant.DiagnosisRecord;

public interface DiagnosisRecordRepository extends JpaRepository<DiagnosisRecord, Long> {
	Optional<List<DiagnosisRecord>> findAllByPlantId(Long plantId);
}

import React from "react";
import NavBar from "../NavBar.js";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from './boardbackenddummy.js'
import "./Board.css"
import UserIcon from '@material-ui/icons/Person';

import {Link} from "react-router-dom";

function Post() {
    return (
        <div className="front">
            <NavBar class="top" />
            <h1>게시글</h1>
            <UserIcon fontSize="large"></UserIcon>
            <Form.Group class="inline" controlId="form.Email" style={{width: "370px"}}>
                <Form.Control type="email" placeholder="아이디 번호로 검색"/>
            </Form.Group>
            <Link to="/administrator/board/post">
                <Button variant="success">검색</Button>
            </Link>
            <Table/>
        </div>
    );
}

export default Post;
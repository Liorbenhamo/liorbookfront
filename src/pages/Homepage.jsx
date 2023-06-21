import "./homepage.css";
import { useState } from "react";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { InfoContext } from "../App";
import { useForm } from "react-hook-form";
import axios from "axios";
import Posts from "../component/posts";

function Homepage() {
  const info = React.useContext(InfoContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));
  React.useEffect(() => {
    const takeposts = async () => {
      try {
        const res = await fetch("https://liorbookapi.onrender.com/posts");
        const data = await res.json();
        info.setAllposts(data);
      } catch (err) {
        console.log(err);
      }
    };
    takeposts();
  }, []);

  return (
    <div id="pagefather">
      <div className="continer">
        {info.allposts?.map((item) => (
          <div className="margin">
            <Posts post={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;

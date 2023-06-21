import React, { useEffect, useState } from "react";
import { InfoContext } from "../App";
import { useForm } from "react-hook-form";
import "./profile.css";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Posts from "../component/posts";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { CloudinaryImage } from "@cloudinary/url-gen";

function Profile() {
  const info = React.useContext(InfoContext);
  const [changephoto, setChangephoto] = useState(false);
  const [photourl, setPhotourl] = useState();
  const filteredcom = info.allposts?.filter(
    (item) => item?.username?._id == info.correntuser._id
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  async function onchange(e) {
    const imageUrl = e.target.files[0];
    if (imageUrl) {
      const formData = new FormData();
      formData.append("file", imageUrl);
      formData.append("upload_preset", "b5w6nssf");
      await axios
        .post(
          "https://api.cloudinary.com/v1_1/dbhkoyzin/image/upload",
          formData
        )
        .then((res) => setPhotourl(res.data.secure_url));
    }
  }

  const onSubmit2 = async () => {
    try {
      await axios.put("https://liorbookapi.onrender.com/put", {
        userimgurl: photourl,
        _id: info.correntuser._id,
      });
      info.setCorrentuser();
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmit = async (data) => {
    try {
      let tempurl;
      console.log(data.url[0]);
      if (data.url[0]) {
        const formData = new FormData();
        formData.append("file", data.url[0]);
        formData.append("upload_preset", "b5w6nssf");
        await axios
          .post(
            "https://api.cloudinary.com/v1_1/dbhkoyzin/image/upload",
            formData
          )
          .then((res) => (tempurl = res.data.secure_url));
        console.log(tempurl);
      }
      await axios.post("https://liorbookapi.onrender.com/posts", {
        username: info.correntuser._id,
        comment: data.text,
        imgurl: tempurl,
      });

      Navigate("/");
      info.setCorrentuser();
    } catch (err) {
      console.log(err);
    }
  };
  function handlephotoclick() {
    if (changephoto) {
      setChangephoto(false);
    } else {
      setChangephoto(true);
    }
  }
  return (
    <div className="body">
      <div className="contiener">
        <div className="profileopening">
          <img
            onClick={handlephotoclick}
            id="profilephoto"
            src={info.correntuser.userimgurl}
            alt={info.correntuser.firstname}
          />
          <div>
            {changephoto ? (
              <div>
                <input onChange={(e) => onchange(e)} type="file" />
                <br />
                <button onClick={onSubmit2}>change</button>
              </div>
            ) : (
              <div></div>
            )}

            <h1>
              welcome to your profile {info.correntuser.firstname}{" "}
              {info.correntuser.lastname}
            </h1>
          </div>
        </div>
        <div className="postpostform">
          <h2>add new post:</h2>
          <form id="addpostform" onSubmit={handleSubmit(onSubmit)}>
            <label>image url:</label>
            <br />
            <input type="file" {...register("url")} />
            <br />

            <label>text:</label>
            <br />
            <textarea
              placeholder="post text"
              type="text"
              {...register("text", { required: true })}
            />
            {errors.text && <div>text is required</div>}
            <br />

            <input type="submit" />
          </form>
        </div>
        <div className="postscard">
          {filteredcom?.reverse().map((item) => (
            <div className="margin">
              <Posts post={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Profile;

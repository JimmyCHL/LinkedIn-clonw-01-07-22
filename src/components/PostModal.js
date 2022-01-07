import React, { useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import { postArticlesApi } from "../actions";
import { serverTimestamp } from "firebase/firestore";

const PostModal = (props) => {
  const [editorText, setEditorText] = useState("");
  const [shareImage, setShareImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [assetArea, setAssetArea] = useState("");
  //   let test = shareImage && URL.createObjectURL(shareImage);
  //   console.log(test);

  //console.log(shareImage);

  //selecting photo file
  const handleChange = (e) => {
    const image = e.target.files[0];

    if (image === "" || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }

    setShareImage(image);
  };

  //switch uploading photo or video
  const switchAssetArea = (area) => {
    setShareImage("");
    setVideoLink("");
    setAssetArea(area);
  };

  const postArticle = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }

    const payload = {
      image: shareImage,
      video: videoLink,
      user: props.user,
      description: editorText,
      timestamp: serverTimestamp(),
    };

    props.postArticle(payload);
    reset(e);
  };

  //when close the modal
  const reset = (e) => {
    e.preventDefault();
    setEditorText("");
    setShareImage("");
    setVideoLink("");
    setAssetArea("");
    props.handleClick(e);
  };

  return (
    <>
      {props.showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post</h2>
              <button onClick={reset}>
                <img src="/images/close-icon.svg" alt="" />
              </button>
            </Header>
            <SharedContent>
              <UserInfo>
                {props.user?.photoURL ? (
                  <img src={props.user.photoURL} />
                ) : (
                  <img src="images/user.svg" alt="" />
                )}

                <span>{props.user?.displayName}</span>
              </UserInfo>
              <Editor>
                <textarea
                  value={editorText}
                  placeholder="What do you want to talk about?"
                  autoFocus={true}
                  onChange={(e) => setEditorText(e.target.value)}
                />
                {assetArea === "image" ? (
                  <UploadImage>
                    <input
                      type="file"
                      name="image"
                      id="file"
                      style={{ display: "none" }}
                      accept="image/gif, image/png, image/jpeg, image/jpg"
                      onChange={handleChange}
                    />
                    <p>
                      <label htmlFor="file">Select an image to share</label>
                    </p>
                    {shareImage && (
                      <img src={URL.createObjectURL(shareImage)} />
                    )}
                  </UploadImage>
                ) : (
                  <>
                    {assetArea === "media" && (
                      <UploadImage>
                        <input
                          type="text"
                          placeholder="Please input a video link."
                          value={videoLink}
                          onChange={(e) => setVideoLink(e.target.value)}
                        />
                        {videoLink && (
                          <ReactPlayer
                            width={"100%"}
                            url={videoLink}
                            controls={true}
                          />
                        )}
                      </UploadImage>
                    )}
                  </>
                )}
              </Editor>
            </SharedContent>
            <ShareCreation>
              <AttachAssets>
                <AssetButton onClick={() => switchAssetArea("image")}>
                  <img src="/images/share-image.svg" alt="" />
                </AssetButton>
                <AssetButton onClick={() => switchAssetArea("media")}>
                  <img src="/images/share-video.svg" alt="" />
                </AssetButton>
              </AttachAssets>
              <ShareComment>
                <AssetButton>
                  <img src="/images/share-comment.svg" alt="" />
                  Anyone
                </AssetButton>
              </ShareComment>
              <PostButton
                onClick={(event) => postArticle(event)}
                disabled={!editorText ? true : false}
              >
                Post
              </PostButton>
            </ShareCreation>
          </Content>
        </Container>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postArticle: (payload) => dispatch(postArticlesApi(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.8);
  animation fadeIn 0.5s ease-in-out;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    &:hover {
      background: lightgray;
      border-radius: 50%;
      cursor: pointer;
    }
    img {
      pointer-events: none;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const UserInfo = styled.div`
 display: flex;
 align-items:center;
 padding 12px 24px;
 svg,img{
     width: 48px;
     height: 48px;
     background-clip: content-box;
     border:2px solid transparent;
     border-radius:50%;
 }
 span{
     font-weight:600;
     font-size:16px;
     line-height:1.5;
     margin-left:5px;
 }
`;

const ShareCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.5);
  background-color: lightgray;
  border: solid 1px rgba(0, 0, 0, 0.5);
  padding: 0 8px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const AttachAssets = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
  ${AssetButton} {
    width: 40px;
  }
`;
const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.15);
  ${AssetButton} {
    svg {
      margin-right: 5px;
    }
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) => (props.disabled ? "rgba(0,0,0,0.18)" : "#0a66c2")};
  color: white;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.disabled ? "rgba(0,0,0,0.18)" : "#004182")};
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    box-sizing: border-box;
    width: 100%;
    min-height: 100px;
    resize: none;
    padding: 5px;
    border: gray solid 2px;
    &:focus-within {
      outline: none;
      border-radius: 5px;
    }
  }

  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
    border: gray solid 2px;
    &:focus-within {
      outline: none;
      border-radius: 5px;
    }
  }
`;

const UploadImage = styled.div`
  text-align: center;
  img {
    width: 100%;
  }
`;

"use client";

import React, { useEffect, useState } from "react";
import styles from "./postsList.module.css";
import PostCard from "../PostCard/PostCard";
import { showToast, toastStatus } from "@/utils/toast";
import Loader from "@/components/Loader/Loader";
import { Pagination, Typography } from "@mui/material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addPosts, addSavedPosts } from "@/redux/slices/profileUserSlice";
import { useLazyGetPostsQuery } from "@/redux/api/postsApi";
import { ErrorBlock } from "@/components/Error/Error";

var prevoiusPage;

const PostList = ({ saved }) => {
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const {
    posts: allPosts,
    savedPosts,
    profile: profileUser,
  } = useSelector((state) => state.profile);

  const [currPage, setCurrPage] = useState(1);

  const [getPosts, { isError, isFetching, error, data }] =
    useLazyGetPostsQuery();

  const dispatch = useDispatch();

  // Retrieving stored posts of profile user from redux
  const initialPosts = saved ? savedPosts : allPosts;

  // posts - local component state to store fetched posts o profile user!
  const [posts, setPosts] = useState(
    initialPosts ? initialPosts[currPage] : initialPosts
  );

  let postsCount = saved
    ? profileUser?.savedPosts.length
    : profileUser?.postCount;

  const POSTS_PER_PAGE = 4;
  let pages = Math.ceil(postsCount / POSTS_PER_PAGE);

  const getPostsOfUser = async (currPage) => {
    if (initialPosts && Object.keys(initialPosts).includes(String(currPage))) {
      return setPosts(initialPosts[currPage]);
    }
    const query = `uId=${profileUser?.id}&page=${currPage}&${
      saved ? `saved=true` : ""
    }`;
    getPosts(query);
  };

  useEffect(() => {
    if (isError) {
      showToast(error?.data, toastStatus.ERROR);
    } else if (data?.posts) {
      setPosts(data.posts);
      postsCount = data.postCount;
      dispatch(
        saved
          ? addSavedPosts({ savedPosts: data.posts, page: currPage })
          : addPosts({ posts: data.posts, page: currPage })
      );
    }
  }, [data, error, isError]);

  useEffect(() => {
    // useEffect to update the page no to the -1 of current page

    // This logic is necessary when the user is on the 'Saved Posts' tab. Consider a scenario where the user is on page 3 of the 'Saved Posts' tab, and there is only one post on that page. If the user attempts to unsave the post from there, in the SavePostComponent where we handle saving/unsaving posts, we clear the saved post data stored in Redux. When the data is cleared, we fetch the fresh/updated list of saved posts with the current page number.

    // However, if the user is on page 3 and the post he/him trying to unsave is the last post, we don't need to refetch the saved posts from page 3. Instead, we should fetch the data from the previous page (page 2 if on page 3, or the preceding page based on the current page number).

    // This adjustment is necessary only when there is exactly one post on the last page.

    // The following logic handles the reduction of the page number based on this condition, and once the page number changes, we fetch the saved posts for the updated page.

    if (
      saved &&
      currPage > 1 &&
      profileUser?.savedPosts.length === (currPage - 1) * POSTS_PER_PAGE
    ) {
      setCurrPage((page) => page - 1);
      // prevoiusPage = "reset";
    }
  }, [profileUser?.savedPosts.length]);

  useEffect(() => {
    if (
      (saved && profileUser?.savedPosts.length < 1) ||
      (!saved && profileUser?.postCount < 1)
    ) {
      return setPosts([]);
    }

    const controller = new AbortController();
    const signal = controller.signal;

    // Condition to check wheather the savedPostsCount on currPage/selectedPage no is === 0 if so then return - no need to do a fetch call!
    let savedPostsCountOnCurrentPage =
      profileUser?.savedPosts.length - (currPage - 1) * POSTS_PER_PAGE;

    if (saved && savedPostsCountOnCurrentPage === 0) return;

    if (
      (prevoiusPage && prevoiusPage !== currPage) ||
      (profileUser && !initialPosts)
    ) {
      profileUser && getPostsOfUser(currPage, signal);
    }

    // scrolling Tabs view after fetching new page posts when page is changed
    let subscribersText = document.getElementById("subscribersText");
    prevoiusPage &&
      prevoiusPage !== currPage &&
      setTimeout(() => {
        window.innerWidth > 770
          ? window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          : subscribersText &&
            subscribersText.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
      }, 100);

    prevoiusPage = currPage;

    // Aborting request to server if component is unmount before succesing the request or user press back button before the request gets succeed!
    return () => controller.abort();
  }, [profileUser?.id, currPage, initialPosts]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.postsContainer}>
        {isFetching && <Loader />}
        {!isFetching &&
          posts?.map((post) => {
            return (
              <PostCard key={post.id} post={post} profileUser={profileUser} />
            );
          })}
      </div>
      {posts?.length > 0 && !isFetching && (
        <Pagination
          sx={{ display: "flex", justifyContent: "center" }}
          page={currPage}
          onChange={(e, page) => setCurrPage(page)}
          count={pages}
          color="primary"
        />
      )}
      {posts && posts?.length < 1 && !isFetching && (
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" textAlign={"center"}>
            {profileUser?.id === loggedInUser?.id ? "You" : profileUser?.name}{" "}
            hasn't {saved ? "saved" : "posted"} any posts yet
          </Typography>
          <div className={styles.postsNotFoundImage}>
            <Image
              fill
              src="https://cdni.iconscout.com/illustration/premium/thumb/not-found-4064375-3363936.png"
            />
          </div>
        </div>
      )}
      {isError && <ErrorBlock soure={"posts"} refetch={getPostsOfUser} />}
    </div>
  );
};

export default PostList;

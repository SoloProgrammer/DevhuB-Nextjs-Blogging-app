"use client";

import { Button } from "@mui/material";
import React, { useState } from "react";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/utils/api";
import { showToast, toastStatus } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { followAuthor, unFollowAuthor } from "@/redux/slices/authSlice";

const FollowUserBtn = ({ author }) => {
  const { user, loading: userLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  if (author.id === user?.id) return <></>;
  const isFollowing = () => {
    return user?.following.includes(author.id);
  };
  const router = useRouter();
  const followUnFollowAuthor = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const query = `?authorId=${author.id}&followerId=${user?.id}`;
      const res = await fetch(api.followAuthor(query), { method: "PUT" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error);
      }

      const payload = { authorId: author.id };
      isFollowing()
        ? dispatch(unFollowAuthor(payload))
        : dispatch(followAuthor(payload));

      showToast(json.message, toastStatus.SUCCESS);
      router.refresh();
    } catch (error) {
      showToast(error.message, toastStatus.ERROR);
    } finally {
      setLoading(false);
    }
  };
  if (userLoading) return <></>;
  return (
    <Button
      onClick={followUnFollowAuthor}
      disabled={loading}
      variant="outlined"
      className={styles.followBtn}
    >
      {isFollowing() ? `Following` : `Follow`}
    </Button>
  );
};

export default FollowUserBtn;

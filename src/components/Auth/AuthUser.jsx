"use client";

import { api } from "@/services/api";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, setLoading } from "@/redux/slices/authSlice";
import axiosClient from "@/services/axiosClient";
import { showToast } from "@/utils/toast";

const AuthUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        dispatch(setLoading(true));
        let { data } = await axiosClient.get(api.getUser());
        console.log(data);
        dispatch(addUser(data.user));
      } catch (error) {
        showToast("You are not logged in!", "", "🧑‍💻");
      } finally {
        dispatch(setLoading(false));
      }
    };
    getUser();

    return () => {};
  }, []);
  return <></>;
};

export default AuthUser;

import { UsersListLoadingSkeleton } from "@/components/UserProfileComponents/AudienceStatsDetail/AudienceStatsDetail";
import UsersList from "@/components/UsersList/UsersList";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ReactionsStatsDetail.module.css";
import { TabContext, TabList } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import {
  getReactionImageByType,
  getReactionsCountByType,
} from "../ReactionsCount/ReactionsCount";

const ReactionsStatsDetail = ({
  handleTabChange,
  isLoading,
  theme,
  users,
  reactionType,
  post,
}) => {
  const [show, setShow] = useState(false);
  
  const getReactionTypes = () => {
    return Object.keys(post.reactions).reduce((accum, reactionKey) => {
      accum[reactionKey.toUpperCase()] = reactionKey;
      return accum;
      // OUTPUT: 👇
      // {
      //   LIKE: "like", // if this reaction present in post
      //   UNICORN: "unicorn", // if present ..""
      //   EXPLODING_HEAD: "exploding_head", // if present ..""
      //   RAISED_HANDS: "raised_hands", // if present ..""
      //   FIRE: "fire", // if present ..""
      // };
    }, {});
  };
  const reactionTypes = useMemo(() => getReactionTypes()[post]);

  function getTabValues() {
    // converting reactionTypes object to tabValues as shown below
    // {
    //     "like": "1",
    //     "unicorn": "2",
    //     "exploding_head": "3",
    //     "raised_hands": "4",
    //     "fire": "5"
    // }
    return Object.keys(reactionTypes).reduce((acc, k, i) => {
      acc[reactionTypes[k]] = String(i + 1);
      return acc;
    }, {});
  }
  const tabValues = useMemo(() => getTabValues(), [reactionTypes]);
  const [value, setValue] = useState(tabValues[reactionType]);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 100);
    return () => setShow(false);
  }, []);

  return (
    <div
      className={`${styles.container} ${show && styles.show} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <div className={styles.wrapper}>
        {
          <TabContext value={value}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  variant="scrollable"
                  value={value}
                  onChange={(_, newVal) => {
                    setValue(newVal);
                  }}
                  aria-label="basic tabs example"
                >
                  {Object.keys(reactionTypes).map((reaction, i) => (
                    <Tab
                      onClick={() => handleTabChange(reactionTypes[reaction])}
                      value={String(i + 1)}
                      key={reaction}
                      label={
                        <TabLabel
                          reaction={reaction}
                          reactionTypes={reactionTypes}
                          key={reaction}
                          post={post}
                        />
                      }
                    />
                  ))}
                </TabList>
              </Box>
            </Box>
          </TabContext>
        }
        <div
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {isLoading ? (
            <UsersListLoadingSkeleton />
          ) : (
            <UsersList users={users} />
          )}
        </div>
      </div>
    </div>
  );
};

const TabLabel = ({ reaction, reactionTypes, post }) => {
  return (
    <>
      <img
        width={25}
        src={getReactionImageByType(reactionTypes[reaction])}
        alt={reaction}
      />
      <span style={{ paddingTop: "3px" }}>
        {getReactionsCountByType(post, reactionTypes[reaction])}
      </span>
    </>
  );
};

export default ReactionsStatsDetail;

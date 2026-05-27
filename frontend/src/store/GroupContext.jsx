import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { AuthContext } from "./AuthContext";

import { useFetch } from "../hooks/useFetch";
import { getUri } from "../../http";

export const GroupContext = createContext(null);

const GroupContextProvider = ({ children }) => {
  const [groupData, setGroupData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [createdAssignments, setCreatedAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [markedAssignments, setMarkedAssignments] = useState([]);
  const { token, isAuthenticated, userData, setAuthData } =
    useContext(AuthContext);
  const [groupScore, setGroupScore] = useState({});
  const [individualScores, setIndividualScores] = useState([]);
  const [lecturerGroup, setLecturerGroup] = useState(null);

  const joinLecturerGroup = (group) => {
    setLecturerGroup(group);
  };

  const studentGroups = useMemo(
    () => groupData?.map((g) => g._id),
    [groupData],
  );

  const { isLoading, fetchedData, fetchData } = useFetch(getUri);

  const {
    fetchedData: fetchedAssignments,
    errorMsg: fetchingAssignmentsErrorMsg,
    fetchData: fetchAssignments,
    isLoading: isLoadingFetchAssignments,
  } = useFetch(getUri);

  const {
    fetchedData: fetchedCreatedAssignments,
    errorMsg: fetchingCreatedAssignmentsErrorMsg,
    fetchData: fetchCreatedAssignments,
    isLoading: isLoadingCreatedAssignments,
  } = useFetch(getUri);

  const {
    fetchedData: fetchedSubmittedAssignments,
    errorMsg: fetchingSubmittedAssignmentsErrorMsg,
    fetchData: fetchSubmittedAssignments,
    isLoading: isLoadingSubmittedAssignments,
  } = useFetch(getUri);

  const {
    fetchedData: fetchedMarkedAssignments,
    errorMsg: fetchingMarkedAssignmentsErrorMsg,
    fetchData: fetchMarkedAssignments,
    isLoading: isLoadingMarkedAssignments,
  } = useFetch(getUri);

  useEffect(() => {
    if (isAuthenticated && userData?.schoolEmail) {
      fetchData(
        `${import.meta.env.VITE_GET_GROUP_URI}?schoolEmail=${
          userData.schoolEmail
        }`,
      );
    }
  }, [isAuthenticated, userData?.schoolEmail]);

  useEffect(() => {
    if (fetchedData) {
      setGroupData(fetchedData.userGroups || []);
    }
  }, [fetchedData]);

  useEffect(() => {
    if (
      isAuthenticated &&
      userData?.role === "student" &&
      userData?.schoolEmail &&
      studentGroups.length > 0
    ) {
      const query = new URLSearchParams({
        schoolEmail: userData.schoolEmail,
        groups: JSON.stringify(studentGroups),
      });

      fetchAssignments(
        `${import.meta.env.VITE_GET_GROUP_ASSIGNMENTS_URI}?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    }
  }, [
    isAuthenticated,
    userData?.role,
    userData?.schoolEmail,
    token,
    studentGroups,
  ]);

  useEffect(() => {
    if (userData?.role === "student") {
      if (fetchedAssignments) {
        setAssignments(fetchedAssignments || []);
      }

      if (fetchingAssignmentsErrorMsg) {
        // console.log(fetchingAssignmentsErrorMsg.message);
      }
    }
  }, [fetchedAssignments, fetchingAssignmentsErrorMsg, userData?.role]);

  // ---------------- FETCHING CREATED ASSIGNMENTS ----------------
  useEffect(() => {
    if (
      isAuthenticated &&
      userData?.role === "lecturer" &&
      userData?.schoolEmail &&
      groupData.length > 0
    ) {
      const query = new URLSearchParams({
        schoolEmail: userData.schoolEmail,
        groups: JSON.stringify(studentGroups),
      });

      fetchCreatedAssignments(
        `${
          import.meta.env.VITE_GET_CREATED_ASSIGNMENTS_URI
        }?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    }
  }, [
    isAuthenticated,
    userData?.role,
    userData?.schoolEmail,
    token,
    studentGroups,
  ]);

  useEffect(() => {
    if (userData?.role === "lecturer") {
      if (fetchedCreatedAssignments) {
        setCreatedAssignments(
          fetchedCreatedAssignments.createdAssignments || [],
        );
      }

      if (fetchingCreatedAssignmentsErrorMsg) {
        console.log(fetchingCreatedAssignmentsErrorMsg.message);
      }
    }
  }, [
    fetchedCreatedAssignments,
    fetchingCreatedAssignmentsErrorMsg,
    userData?.role,
  ]);

  // FETCH SUBMITTED ASSIGNMENTS ------------------

  useEffect(() => {
    if (
      (isAuthenticated &&
        userData?.role === "lecturer" &&
        userData?.schoolEmail &&
        groupData.length > 0,
      createdAssignments.length > 0)
    ) {
      const assignmentIds = createdAssignments.map((a) => a._id);
      const query = new URLSearchParams({
        schoolEmail: userData.schoolEmail,
        assignmentIds: JSON.stringify(assignmentIds),
      });

      fetchSubmittedAssignments(
        `${
          import.meta.env.VITE_GET_SUBMITTED_ASSIGNMENTS_URI
        }?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    }
  }, [
    isAuthenticated,
    userData?.role,
    userData?.schoolEmail,
    groupData.length,
    token,
    createdAssignments.length > 0,
  ]);

  useEffect(() => {
    if (userData?.role === "lecturer") {
      if (fetchedSubmittedAssignments) {
        setSubmittedAssignments(
          fetchedSubmittedAssignments.submittedAssignments || [],
        );
      }

      if (fetchingSubmittedAssignmentsErrorMsg) {
        // console.log(fetchingCreatedAssignmentsErrorMsg.message);
      }
    }
  }, [
    fetchedSubmittedAssignments,
    fetchingSubmittedAssignmentsErrorMsg,
    userData?.role,
  ]);

  useEffect(() => {
    if (userData?.role === "student") {
      if (isAuthenticated && assignments.length > 0) {
        const assignmentIds = assignments.map((a) => a._id);
        const studentGroupCodes = groupData.map(
          (groupCode) => groupCode.groupCode,
        );
        const query = new URLSearchParams({
          schoolEmail: userData.schoolEmail,
          assignmentIds: JSON.stringify(assignmentIds),
          groupCodes: JSON.stringify(studentGroupCodes),
        });

        fetchMarkedAssignments(
          `${
            import.meta.env.VITE_GET_GROUP_ASSIGNMENTS_SCORE_URI
          }?${query.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
    }
  }, [userData?.role, isAuthenticated, assignments.length]);

  useEffect(() => {
    if (fetchedMarkedAssignments?.data) {
      setMarkedAssignments(fetchedMarkedAssignments.data);
    }

    if (fetchingMarkedAssignmentsErrorMsg?.data?.message) {
      console.log(fetchingMarkedAssignmentsErrorMsg);
    }
  }, [
    fetchedMarkedAssignments?.data,
    fetchingMarkedAssignmentsErrorMsg?.data?.message,
  ]);

  const createGroup = (data) => {
    setGroupData((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      data.createdGroup,
    ]);
  };

  const joinGroup = (data) => {
    console.log("checking data", data);
    setGroupData((prev) => [...(Array.isArray(prev) ? prev : []), data.group]);
  };

  const deleteGroup = (groupCode) => {
    console.log(groupCode);
  };

  const assignLeader = (memberId) => {};

  const getTotalStudents = (members = []) => members.length;

  const value = {
    lecturerGroup,
    joinLecturerGroup,
    groupData,
    isLoading,
    assignments,
    isLoadingFetchAssignments,
    createdAssignments,
    isLoadingCreatedAssignments,
    submittedAssignments,
    isLoadingSubmittedAssignments,
    createGroup,
    joinGroup,
    setGroupData,
    deleteGroup,
    assignLeader,
    getTotalStudents,
    groupScore,
    setGroupScore,
    individualScores,
    setIndividualScores,
    markedAssignments,
    isLoadingMarkedAssignments,
  };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
};

export default GroupContextProvider;

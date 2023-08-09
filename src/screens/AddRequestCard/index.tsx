import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnimatedFAB } from "react-native-paper";
import Header from "../../../components/Header";
import TabButtons from "../../../components/TabButtons";
import { tintColorDark } from "../../../constants/Colors";
import { useGetRefillRequestsQuery } from "../../../redux/cards/cardsApiSlice";
import { formatDateTime, hp, wp } from "../../../utils";

export default function AddRequestCard(props) {
  const { t, i18n } = useTranslation();
  const {
    data: refillRequestsData,
    error: refillRequestsError,
    isLoading: refillRequestsLoading,
    isSuccess: refillRequestsSuccess,
    refetch: refillRequestsRefetch,
  } = useGetRefillRequestsQuery();

  const [isExtended, setIsExtended] = useState(true);
  const isFocused = useIsFocused();
  const [cardData, setCardData] = useState([]);
  const [cardRequests, setCardRequests] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [approvedRequestCount, setApprovedRequestCount] = useState(0);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  useEffect(() => {
    refillRequestsRefetch();
  }, [isFocused]);

  useEffect(() => {
    if (refillRequestsSuccess) {
      console.log("resData", refillRequestsData?.results);
    }
    if (refillRequestsError) {
      console.log("resError", refillRequestsError);
    }

    const approvedData = refillRequestsData?.results.filter(
      (obj) => obj.status === "approved",
    );

    setApprovedRequestCount(approvedData?.length);
    setPendingRequestCount(
      parseInt(refillRequestsData?.results.length) -
      parseInt(approvedData?.length),
    );

    const sortedResults = refillRequestsData?.results
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setCardRequests(sortedResults);
  }, [isFocused, refillRequestsData]);

  //Remarks - CallBacks
  const filterData = (value) => {
    const localData = [...refillRequestsData?.results];

    if (value === "") {
      const sortedResults = localData
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setCardRequests(sortedResults);
    } else if (value === "Pending") {
      const filteredData = localData.filter((obj) => obj.status === "pending");
      const sortedResults = filteredData
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setCardRequests(sortedResults);
    } else if (value === "Approved") {
      const filteredData = localData.filter((obj) => obj.status === "approved");

      const sortedResults = filteredData
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setCardRequests(sortedResults);
    }
  };

  const renderedItem = (item, index) => {
    return (
      <View
        style={{
          paddingTop: 10,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#ccc", fontSize: 12 }}>
              #{index + 1} {formatDateTime(item?.createdAt)}
            </Text>
            <View
              style={{
                borderRadius: 20,
                padding: 2,
                height: 22,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 8,
                backgroundColor:
                  item?.status === "approved" ? `#2fbc362b` : `#FE6E002B`,
                borderWidth: 1,
                borderColor:
                  item?.status === "approved" ? `#21c729` : `#FE6E00`,
              }}
            >
              <Text
                style={{
                  color: item?.status === "approved" ? "#21c729" : "#FE6E00",
                  textTransform: "capitalize",
                  fontSize: 12,
                }}
              >
                {item.status}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name={"numeric"} color={tintColorDark} size={22} />
            <Text style={styles.text}>{item.cards_amount} cards</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name={"map-marker"} color={tintColorDark} size={22} />
            <Text style={styles.text1}>{item.address1}</Text>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  //Remarks - Floating Animated Button
  const renderCreateNewRequest = () => {
    return (
      <AnimatedFAB
        color="white"
        icon={"plus"}
        label={t("Create New Request")}
        extended={isExtended}
        onPress={() => {
          props.navigation.navigate("RequestCards");
        }}
        visible={true}
        animateFrom={"right"}
        iconMode={"dynamic"}
        style={{
          bottom: 40,
          right: 20,
          position: "absolute",
          backgroundColor: tintColorDark,
        }}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "white",
        },
      ]}
    >
      <Header
        title={t("Request Cards")}
        leftButton={() => props.navigation.goBack()}
      />

      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            marginTop: 20,
          }}
        >
          <TabButtons
            pendingReq="Pending"
            pendingReqNum={pendingRequestCount}
            approvedReq="Approved"
            approvedReqNum={approvedRequestCount}
            btnActionPendingApprove={filterData}
          />
        </View>
        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <Text style={[{ fontSize: 18, fontWeight: "600", color: "#4F4F4F" }]}>
            Total Requests: {refillRequestsData?.results.length}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={cardRequests}
            extraData={cardRequests}
            onScroll={onScroll}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
            }}
            renderItem={({ item, index }) => renderedItem(item, index)}
            ListEmptyComponent={() => (
              <View style={{ marginTop: 200, alignItems: "center" }}>
                <Text>{t("No Cards yet")}</Text>
                <View style={{ marginTop: 50 }}></View>
                <ActivityIndicator size={"large"} color={tintColorDark} />
              </View>
            )}
          />
        </View>
        {renderCreateNewRequest()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: hp(1.7),
    fontWeight: "700",
  },
  buttonBelow: {
    backgroundColor: tintColorDark,
    padding: 10,
    marginLeft: 30,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    borderRadius: 20,
    marginTop: 20,
  },
  listContainer: {
    flex: 1,
  },
  text: {
    fontSize: hp(2.2),
    fontWeight: "bold",
    marginLeft: 8,
  },
  text1: {
    fontSize: hp(1.7),
    marginLeft: 8,
  },
  divider: {
    height: wp(0.2),
    width: "100%",
    backgroundColor: "#DEDEDE",
    marginTop: 10,
    // marginVertical: hp(1),
  },
});

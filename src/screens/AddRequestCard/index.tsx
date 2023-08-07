import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Header from "../../../components/Header";
import { useTranslation } from "react-i18next";
import { useGetRefillRequestsQuery } from "../../../redux/cards/cardsApiSlice";
import { useIsFocused } from "@react-navigation/native";
import { formatDateTime, hp } from "../../../utils";
import Button from "../../../components/Button";
import Colors, { tintColorDark } from "../../../constants/Colors";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Toast from "react-native-root-toast";
import { ActivityIndicator } from "react-native";

export default function AddRequestCard(props) {
  const { t, i18n } = useTranslation();
  const {
    data: refillRequestsData,
    error: refillRequestsError,
    isLoading: refillRequestsLoading,
    isSuccess: refillRequestsSuccess,
    refetch: refillRequestsRefetch,
  } = useGetRefillRequestsQuery();

  const isFocused = useIsFocused();
  const [cardData, setCardData] = useState([]);
  const [cardRequests, setCardRequests] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

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
    const sortedResults = refillRequestsData?.results
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setCardRequests(sortedResults);
  }, [isFocused, refillRequestsData]);

  const renderedItem = (item, index) => {
    return (
      <View style={styles.cardContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                item?.status === "approved" ? `#2fbc362b` : `#d300152b`,
              borderWidth: 1,
              borderColor: item?.status === "approved" ? `#21c729` : `#ff0019`,
            }}
          >
            <Text
              style={{
                color: item?.status === "approved" ? "#21c729" : "#ff0019",
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
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t("Request Cards")} />

      <Button
        onPress={() => props.navigation.navigate("RequestCards")}
        style={styles.buttonBelow}
      >
        <Text style={{ color: "white" }}>{t("Create New Request")}</Text>
      </Button>

      <View style={styles.listContainer}>
        <FlatList
          data={cardRequests}
          extraData={cardRequests}
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
    margin: 10,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: hp(1),
    marginVertical: hp(0.5),
    padding: 15,
    elevation: 2,
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
});

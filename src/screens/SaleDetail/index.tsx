import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import React from "react";
import { formatDateTime, hp, wp } from "../../../utils";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import Text from "../../../components/Text";

import {
  useGetSaleDetailMutation,
  useResendPaymentRequestMutation,
  useGetClientInfoMutation,
} from "../../../redux/sale/saleApiSlice";
import { tintColorDark } from "../../../constants/Colors";
import RNModal from "react-native-modal";
import Toast from "react-native-root-toast";
import { AirbnbRating } from "react-native-ratings";
export default function SaleDetail(props: any) {
  const [getSaleDetail, { isLoading }] = useGetSaleDetailMutation();
  const [resendPaymentRequest, resendPaymentRequestResp] =
    useResendPaymentRequestMutation();
  const [getClientInfo, getClientInfoResp] = useGetClientInfoMutation();

  const [saleDetail, setSaleDetail] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [clientDetail, setClientDetail] = useState({});
  useEffect(() => {
    getSaleDetailApi();
  }, []);

  const getSaleDetailApi = async () => {
    const saleId = props?.route?.params?.sale?.id;
    try {
      const resp = await getSaleDetail(saleId);
      // console.log("resp--->", resp?.data);
      setClientDetail(resp?.data?.businessInfo);

      setSaleDetail(resp?.data?.sale);
    } catch (error) {
      console.log("error--->", error);
    }
  };

  const getResendPaymentRequest = async () => {
    try {
      const resp = await resendPaymentRequest(saleDetail?.id);

      if (resp?.error?.data?.code == 429) {
        Toast.show(resp?.error?.data?.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        Toast.show("Payment request sent!", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error) {
      console.log("error in resend payment", error);
    }
  };

  const getClientDetail = async () => {
    try {
      const resp = await getClientInfo(saleDetail?.id);
      if (resp?.data) {
        setClientDetail(resp?.data?.businessInfo);
        setIsVisible(true);
      }

      console.log("resp----client info", resp);
    } catch (error) {
      console.log("error in get client", error);
    }
  };
  const renderModal = () => {
    return (
      <RNModal
        isVisible={isVisible}
        onBackButtonPress={() => {
          setIsVisible(false);
        }}
        onBackdropPress={() => {
          setIsVisible(false);
        }}
        onRequestClose={() => {
          setIsVisible(false);
        }}
        hasBackdrop
        backdropOpacity={0.5}
        backdropColor="#000"
      >
        <View style={styles.rnModalBody}>
          <Image
            source={{
              uri: clientDetail?.image,
            }}
            style={{
              width: "100%",
              height: hp(20),
              borderRadius: 10,
              marginBottom: hp(2),
            }}
          />
          <View style={styles.itemView}>
            <Text style={styles.credsFont}>Name:</Text>
            <Text style={styles.detailFont}>{clientDetail?.name}</Text>
          </View>
          <View style={styles.itemView}>
            <Text style={styles.credsFont}>Address:</Text>
            <Text
              style={{
                ...styles.detailFont,
                textAlign: "right",
                width: wp(50),
              }}
              numberOfLines={2}
            >
              {clientDetail?.formatted_address}
            </Text>
          </View>
          <View style={styles.itemView}>
            <Text style={styles.credsFont}>Rating:</Text>

            <View style={{ ...styles.itemView, alignItems: "center" }}>
              <AirbnbRating
                defaultRating={clientDetail?.rating}
                isDisabled
                size={18}
                showRating={false}
                starContainerStyle={{ bottom: 5 }}
              />
              <Text
                style={{
                  ...styles.detailFont,
                  fontSize: hp(1.5),
                }}
              >
                ({clientDetail?.user_ratings_total})
              </Text>
            </View>
          </View>
        </View>
      </RNModal>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <Header
          title={"Sale Detail"}
          leftButton={() => props.navigation.goBack()}
        />
        {isLoading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color={tintColorDark} />
          </View>
        ) : (
          <View style={styles.innerContainer}>
            <Image
              source={{
                uri: clientDetail?.image,
              }}
              style={{
                width: "100%",
                height: hp(20),
                borderRadius: 10,
                marginBottom: hp(2),
              }}
            />
            <View style={styles.itemView}>
              <Text style={styles.credsFont}>Client:</Text>
              <Text style={styles.detailFont}>{saleDetail?.client?.name}</Text>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.credsFont}>Card amount:</Text>
              <Text style={styles.detailFont}>{saleDetail?.cards_amount}</Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.credsFont}>Price:</Text>
              <Text style={styles.detailFont}>
                {saleDetail?.price?.amount} {saleDetail?.price?.currency}
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.credsFont}>Payment Status:</Text>
              {/* <Text style={styles.detailFont}>
              {saleDetail?.payment_link?.paid ? "Paid" : "Unpaid"}
            </Text> */}
              <View
                style={{
                  ...styles?.paidCard,
                  width: saleDetail?.payment_link?.paid ? 42 : 66,
                  backgroundColor: saleDetail?.payment_link?.paid
                    ? `#2fbc362b`
                    : `#d300152b`,
                  borderWidth: 1,
                  borderColor: saleDetail?.payment_link?.paid
                    ? `#21c729`
                    : `#ff0019`,
                }}
              >
                <Text
                  style={{
                    ...styles.paidText,
                    color: saleDetail?.payment_link?.paid
                      ? "#21c729"
                      : "#ff0019",
                  }}
                >
                  {saleDetail?.payment_link?.paid ? "Paid" : "Not Paid"}
                </Text>
              </View>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.credsFont}>Date:</Text>
              <Text style={styles.detailFont}>
                {formatDateTime(saleDetail?.createdAt)}
              </Text>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.credsFont}>Address:</Text>
              <Text
                style={{
                  ...styles.detailFont,
                  textAlign: "right",
                  width: wp(50),
                }}
                numberOfLines={2}
              >
                {clientDetail?.formatted_address}
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.credsFont}>Rating:</Text>

              <View style={{ ...styles.itemView, alignItems: "center" }}>
                <AirbnbRating
                  defaultRating={clientDetail?.rating}
                  isDisabled
                  size={18}
                  showRating={false}
                  starContainerStyle={{ bottom: 5 }}
                />
                <Text
                  style={{
                    ...styles.detailFont,
                    fontSize: hp(1.5),
                  }}
                >
                  ({clientDetail?.user_ratings_total})
                </Text>
              </View>
            </View>
            {/* {renderModal()} */}
          </View>
        )}
      </View>
      {saleDetail?.payment_link?.paid == false && isLoading == false && (
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={() => {
              getResendPaymentRequest();
            }}
            isLoading={resendPaymentRequestResp.isLoading}
            disabled={resendPaymentRequestResp.isLoading}
            loaderColor={styles.loaderColor}
          >
            <Text style={styles.buttonText}>Resend Payment Request</Text>
          </Button>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    marginHorizontal: hp(2.5),
    marginTop: hp(2),
  },
  button: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),
    height: hp(7),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: hp(3),
    marginBottom: hp(3),
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    backgroundColor: "white",
    // marginBottom: hp(3),
    paddingHorizontal: hp(2.5),
  },
  loaderColor: {
    color: "white",
  },
  detailFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "#ccc",
    marginBottom: hp(1),
  },
  credsFont: {
    fontSize: hp(2),
    color: "black",
    fontWeight: "700",

    marginBottom: hp(1),
  },
  itemView: { flexDirection: "row", justifyContent: "space-between" },
  rnModalBody: {
    backgroundColor: "#fff",
    borderRadius: hp(1.5),
    padding: hp(2.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    // alignItems: "center",
    flex: 0.5,
  },
  paidCard: {
    borderRadius: 10,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  paidText: { fontSize: 12 },
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

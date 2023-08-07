import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, FlatList, Image, RefreshControl, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card } from 'react-native-paper';
import Toast from "react-native-root-toast";
import Header from "../../../components/Header";
import Text from "../../../components/Text";
import {
  useDeletePayoutMethodMutation,
  useGetPayoutMethodQuery,
  useGetPayoutsQuery,
} from "../../../redux/user/userApiSlice";
import { formatDateTime, hp, wp } from "../../../utils";


export default function UserPayouts(props: any) {
  const { t } = useTranslation();
  const focused = useIsFocused();

  const {
    data: payouts,
    isError,
    isLoading,
    refetch,
  } = useGetPayoutMethodQuery();

  const [page, setPage] = useState(1);
  const [payoutsListData, setPayoutsListData] = useState([]);

  const {
    data: payoutsData,
    isError: pauoutsIsError,
    isLoading: payoutsIsLoading,
    refetch: refetchPayouts,
  } = useGetPayoutsQuery({ page: page, limit: 20, sortBy: 'createdAt:desc' });

  useEffect(() => {

    if (page === 1) {
      setPayoutsListData((!!payoutsData && !!payoutsData.results && payoutsData.results.length > 0) ? (payoutsData.results) : ([]));
    } else if (!!payoutsData && !!payoutsData.results && payoutsData.results.length > 0) {

      setPayoutsListData(payoutsListData.concat(payoutsData.results));
    }
  }, [payoutsData])

  useEffect(() => {
    if (page === 1) {
      refetchPayouts();
    }
  }, [page])



  const [deletePayoutMethod, deletePayoutMethodResp] =
    useDeletePayoutMethodMutation();

  // useEffect(() => {
  //   refetch();
  // }, [focused]);
  const deletePayout = async () => {
    try {
      const resp = await deletePayoutMethod(payouts?.id);

      if (resp) {
        Toast.show(t("Payout method deleted!"), {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //REMARK: Recent Transaction And Sorting View
  const renderRecentTransactionAndSortingView = () => {
    return (
      <View style={{ justifyContent: 'space-between', marginTop: 20, flexDirection: 'row' }}>

        <View style={{ justifyContent: "center" }} >
          <Text style={{ fontSize: 22 }}>{'Recent Transactions'}</Text>
        </View>

        <TouchableOpacity style={{
          justifyContent: 'center', alignItems: 'center', height: wp(7),
          // width: wp(7)
        }}
        // onPress={this.onPress}
        >
          <Icon
            name={"sort"}
            color={"black"}
            size={30}
            onPress={() => {

            }}
          />
          {/* <Image
        style={{height: wp(5),
          width: wp(5)}}
        resizeMode="contain"
        source={require("../../../assets/images/money.png")}
      /> */}
        </TouchableOpacity>
      </View>
    );
  }

  const handleLoadMore = () => {
    if (!payoutsIsLoading && !pauoutsIsError && (!!payoutsListData && !!payoutsListData) ? payoutsListData.length > 0 : false) {
      setPage(page + 1);
    }
  };
  //REMARK: Recent Transaction Flat List View
  const renderRecentTransactionListView = () => {
    return (
      <View style={{
        flex: 1,
        marginTop: 5
      }}>
        <FlatList
          data={payoutsListData}
          style={{
            // marginVertical: RFValue(20),
            // flex: 1,
          }}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item, index }) => {
            return (
              <View>
                <View style={{ backgroundColor: 'white', marginTop: 20, flexDirection: 'row', paddingVertical: 10 }}>
                  <View style={{ flex: 0.2, alignSelf: 'center', alignItems: 'center' }}>
                    <Image
                      style={styles.bankIcon}
                      resizeMode="contain"
                      source={
                        item?.method == "cash"
                          ? require("../../../assets/images/money.png")
                          : item?.method == "bank"
                            ? require("../../../assets/images/bank.png")
                            : item?.method == "crypto"
                              ? require("../../../assets/images/crypto.jpg")
                              : require("../../../assets/images/paypal.png")
                      }
                    />
                  </View>

                  <View style={{ flex: 0.5, alignItems: 'flex-start', }}>
                    <Text style={{ fontSize: 16 }}>{'Payout'}</Text>
                    <Text style={{ fontSize: 14 }}>{formatDateTime(item?.createdAt)}</Text>
                  </View>

                  <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, color: 'green', }}>{item.currency + ' ' + item.amount}</Text>
                  </View>


                </View>
                <View style={styles.divider} />
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              tintColor={'#000000'}
              title={'Refreshing...'}
              titleColor={'#000000'}
              refreshing={false}
              onRefresh={() => {
                setPage(1);
              }}
            />
          }
          ListFooterComponent={payoutsIsLoading && <Text style={{
            color: 'black'
          }}>Loading more...</Text>}

          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
        />
      </View>

    );
  }

  return (
    <>
      <View style={styles.container}>
        <Header
          title={t("Payout Methods")}
          leftButton={() => props.navigation.goBack()}
        />
        <View style={[styles.innerContainer, {
          flex: 1
        }]}>
          {payouts ? (
            <View style={{
              flex: 0.97
            }}>
              <Card style={{
                backgroundColor: "#FAFAFA"
              }}>
                <View style={{
                  flexDirection: 'row',
                  padding: 20,
                }}>
                  <View
                    style={{
                      // height: hp(10),
                      flex: 1,
                      // borderRadius: 14,
                      paddingRight: 5

                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{
                        height: wp(16),
                        width: wp(16),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "#BDBDBD",
                        // borderColor: '#4F4F4F',
                        // borderWidth: 1,
                        borderRadius: wp(16),
                      }}>
                        <Image
                          style={styles.bankIcon}
                          resizeMode="contain"
                          source={
                            payouts?.method == "cash"
                              ? require("../../../assets/images/money.png")
                              : payouts?.method == "bank"
                                ? require("../../../assets/images/bank.png")
                                : payouts?.method == "crypto"
                                  ? require("../../../assets/images/crypto.jpg")
                                  : require("../../../assets/images/paypal.png")
                          }
                        />
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10 }}>
                        <View style={{
                          flex: 1
                        }}>
                          <Text
                            style={{
                              fontWeight: "500",
                              fontSize: 20,
                              // marginBottom: hp(0.5),
                            }}
                          >
                            {payouts?.method == "crypto"
                              ? "Anonymous"
                              : payouts?.accountHolder}
                          </Text>
                          {payouts?.method == "crypto" ? (
                            <Text style={styles.bankName}>{payouts?.routing}</Text>
                          ) : null}
                          <Text style={[styles.bankName, {
                            fontSize: (payouts?.method == "crypto") ? (12) : (16)
                          }]}>
                            {payouts?.bankName} - {payouts?.account}
                          </Text>
                        </View>

                        <View
                          style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center" }}
                        >
                          <Text style={{ color: "#7DCAAE" }}>{payouts?.region}</Text>

                        </View>

                      </View>
                    </View>

                    {/* <View style={styles.divider} /> */}
                  </View>
                  <View style={{
                    // height: '100%',
                    justifyContent: 'center',
                    // backgroundColor: "#990099"
                  }}>
                    <Icon
                      name={"delete"}
                      color={"#ff6669"}
                      size={30}
                      onPress={() => {
                        Alert.alert(t("Delete payout method"), "", [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: "Yes",
                            onPress: () => deletePayout(),
                          },
                        ]);
                      }}
                    />
                  </View>
                </View>
              </Card>

              {renderRecentTransactionAndSortingView()}
              {renderRecentTransactionListView()}

            </View>
          ) : (
            props?.navigation?.navigate("Settings")
          )}

        </View>
      </View>
      {/* <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={() => {
            
          }}
        >
          <Text style={styles.buttonText}>Delete payout method</Text>
        </Button>
      </View> */}
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
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginTop: hp(1),
  },
  button: {
    backgroundColor: "#d40101",
    borderRadius: hp(5),
    height: hp(7),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
  bankName: {
    fontSize: 12,
    marginTop: 2,
    color: '#757575'
  },
  divider: {
    height: wp(0.2),
    width: "100%",
    backgroundColor: "#DEDEDE",
    marginVertical: hp(1),
  },
  bankIcon: {
    height: wp(10),
    width: wp(10),
    // alignSelf: "center",
    // marginRight: hp(1),
  },
});

import { useIsFocused } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import CountrySelector from "react-native-country-picker-modal";
import { ActivityIndicator } from "react-native-paper";
import Toast from "react-native-root-toast";
import * as yup from "yup";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import { tintColorDark } from "../../../constants/Colors";
import {
  useCheckRefillEligibityQuery,
  useRequestRefillCardsMutation,
} from "../../../redux/cards/cardsApiSlice";
import { hp } from "../../../utils";
import { getFlagEmoji } from "../../helpers/misc";

export default function SellerRequestCard(props) {
  const _formik = useRef();
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const [cards_sold, setCardsSold] = useState(0);
  const [cards_pending, setCardsPending] = useState(0);
  const [progress, setProgress] = useState(0);
  const [country, setCountry] = useState<any>({});
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countryFlag, setCountryFlag] = useState("");
  const [isEligible, setEligible] = useState(false);

  const [requestRefillCards, { isLoading }] = useRequestRefillCardsMutation();
  const {
    data: refillEligibilityData,
    error: refillEligibilityError,
    isLoading: refillEligibilityLoading,
    isSuccess: refillEligibilitySuccess,
    refetch: refillEligibilityRefetch,
  } = useCheckRefillEligibityQuery();
  const isFocued = useIsFocused();

  useEffect(() => {
    refillEligibilityRefetch();
  }, [isFocued]);

  useEffect(() => {
    if (refillEligibilitySuccess) {
      setCardsSold(refillEligibilityData?.cards_sold);
      setCardsPending(
        refillEligibilityData?.cards_fulfilled -
        refillEligibilityData?.cards_sold,
      );

      const total_cards = refillEligibilityData?.cards_fulfilled;
      const percentage = (
        (refillEligibilityData?.cards_sold / total_cards) *
        100
      ).toFixed(2);
      setProgress(Number(percentage));
      setEligible(refillEligibilityData?.eligible);

      if (!refillEligibilityData?.eligible) {
        props.navigation.replace("SellerRequestCardsPending");
      }
    }
  }, [refillEligibilityData]);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = yup.object().shape({
    country: yup.string("Required").required("Country is required"),
    address1: yup.string("Required").required("Address1 is required"),
    // address2: yup.string("Required").required("Address2 is required"),
    city: yup.string("Required").required("City is required"),
    phone: yup
      .string("Required")
      .matches(phoneRegExp, "Phone number is not valid"),

    cards_amount: yup.string("Required").required("Card amount is required"),
  });

  const createCardReuest = async (values: object) => {
    try {
      if (values?.cards_amount <= 50) {
        var body = {
          address1: values.address1,
          cards_amount: values.cards_amount,
          city: values.city,
          country: values.country,
        };

        if (!!values?.phone) {
          body.phone = countryCode + values?.phone;
        }

        if (!!values?.address2) {
          body.address2 = values?.address2;
        }
        if (!!values?.zip) {
          body.zip = values?.zip;
        }

        const resp = await requestRefillCards(body);

        if (!!resp?.error) {
          Toast.show(resp?.error.data.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
        } else {
          if (resp?.data === null) {
            Toast.show("Your card Request is created successfully.", {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
            props.navigation.replace("SellerRequestCardsPending");
          }
        }
      } else {
        Toast.show("Cards amount must be less than or equal to 50", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (e) {
      console.log("creatCardError--->", e);
    }
  };

  //
  return (
    (!isEligible) ? (
      <View style={{
        flex: 1,
        justifyContent: 'center'
      }}>
        <ActivityIndicator size="small" color={'black'} />
      </View>
    ) : (<View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        title={t("Create New Request Card")}
      />
      <ScrollView
        style={[styles.container]}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.inputContainer}>
          <Formik
            innerRef={_formik}
            key={countryCode} // add this prop for changes the country value
            initialValues={{
              country: countryName,
              address1: "",
              address2: "",
              city: "",
              phone: "",
              zip: "",
              cards_amount: "",
            }}
            validationSchema={validationSchema}
            validateOnBlur={false}
            onSubmit={(values) => createCardReuest(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <Text style={styles.credsFont}>{t("Country")}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#aaa",
                    marginBottom: 6,
                  }}
                >
                  {t(
                    "Please select the country where you will make sales. This can be different from your country of nationality.",
                  )}
                </Text>
                <CountrySelector
                  containerButtonStyle={{
                    ...styles.inputField,
                    height: hp(6),
                    width: "100%",
                    justifyContent: "center",
                  }}
                  withAlphaFilter
                  withCountryNameButton
                  withFilter
                  countryCode={country?.cca2}
                  onSelect={(c) => {
                    setCountry(c);

                    setCountryName(c.name);
                    setCountryCode(c.callingCode[0]);

                    handleChange("country")(c.name);

                    if (c.callingCode[0]) {
                      setCountryCode(`+${c.callingCode[0]}`);
                    } else {
                      setCountryCode("+1");
                    }
                    if (c.cca2) {
                      setCountryFlag(getFlagEmoji(c.cca2));
                    }
                  }}
                />
                {errors.country && touched.country && (
                  <Text style={styles.errorText}>{t(errors.country)}</Text>
                )}

                <Text style={styles.credsFont}>{t("Address Line 1")}</Text>
                <Input
                  onChangeText={(text) => handleChange("address1")(text)}
                  onBlur={handleBlur("address1")}
                  value={values.address1}
                  style={styles.inputField}
                  icon
                  iconName="map-marker"
                  inputViewStyle={styles.inputViewStyle}
                  iconColor={"#ccc"}
                  autoCapitalize={"none"}
                  placeholder={t("Enter your address")}
                />
                {errors.address1 && touched.address1 && (
                  <Text style={styles.errorText}>{errors.address1}</Text>
                )}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Text style={{ ...styles.credsFont, marginTop: 10 }}>
                    {t("Address Line 2 ")}
                  </Text>

                  <Text style={{ ...styles.credsFont, marginTop: 10, fontSize: hp(1.5), color: 'gray' }}>
                    {t("(optional)")}
                  </Text>
                </View>
                <Input
                  onChangeText={(text) => handleChange("address2")(text)}
                  onBlur={handleBlur("address2")}
                  value={values.address2}
                  style={styles.inputField}
                  icon
                  iconName="map-marker"
                  inputViewStyle={styles.inputViewStyle}
                  iconColor={"#ccc"}
                  autoCapitalize={"none"}
                  placeholder={t("Enter your address")}
                />
                {errors.address2 && touched.address2 && (
                  <Text style={styles.errorText}>{errors.address2}</Text>
                )}
                <Text style={{ ...styles.credsFont, marginTop: 10 }}>
                  {t("City")}
                </Text>
                <Input
                  onChangeText={(text) => handleChange("city")(text)}
                  onBlur={handleBlur("city")}
                  value={values.city}
                  style={styles.inputField}
                  icon
                  iconName="city"
                  inputViewStyle={styles.inputViewStyle}
                  iconColor={"#ccc"}
                  autoCapitalize={"none"}
                  placeholder={t("Enter your city")}
                />
                {errors.city && touched.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Text style={{ ...styles.credsFont, marginTop: 10 }}>
                    {t("Phone number ")}
                  </Text>

                  <Text style={{ ...styles.credsFont, marginTop: 10, fontSize: hp(1.5), color: 'gray' }}>
                    {t("(optional)")}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.inputViewStyle,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      // backgroundColor: "#989811"
                    },
                  ]}
                  onPress={() => setShow(true)}
                >
                  {countryCode ? (
                    <Text style={{ width: "20%", marginLeft: 10 }}>
                      {countryFlag + " " + countryCode}
                    </Text>
                  ) : (
                    <Text style={{ width: "15%", marginLeft: 10 }}>🏳️ +0</Text>
                  )}
                  <Input
                    onChangeText={(text: string) => handleChange("phone")(text)}
                    value={values.phone}
                    style={{
                      ...styles.inputField,
                      width: countryCode ? "95%" : "90%",
                    }}
                    icon
                    iconColor={"#ccc"}
                    iconName="phone"
                    inputViewStyle={{
                      // ...styles.inputViewStyle,
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 10,
                      backgroundColor: "#f9f9f9",

                      // marginTop: 10,
                      width: countryCode ? "70%" : "80%",
                    }}
                    autoCapitalize={"none"}
                    placeholder={t("Phone number")}
                    keyboardType="number-pad"
                  // onPressIn={() => setShow(true)}
                  />
                </TouchableOpacity>
                {errors.phone && touched.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Text style={{ ...styles.credsFont, marginTop: 10 }}>
                    {t("Zip Code ")}
                  </Text>

                  <Text style={{ ...styles.credsFont, marginTop: 10, fontSize: hp(1.5), color: 'gray' }}>
                    {t("(optional)")}
                  </Text>
                </View>

                <Input
                  onChangeText={(text) => handleChange("zip")(text)}
                  onBlur={handleBlur("zip")}
                  value={values.zip}
                  style={styles.inputField}
                  icon
                  iconName="math-norm-box"
                  inputViewStyle={styles.inputViewStyle}
                  iconColor={"#ccc"}
                  autoCapitalize={"none"}
                  keyboardType="number-pad"
                  placeholder={t("Enter your zip code")}
                />
                {errors.zip && touched.zip && (
                  <Text style={styles.errorText}>{errors.zip}</Text>
                )}
                <Text style={{ ...styles.credsFont, marginTop: 10 }}>
                  {t("Cards Amount")}
                </Text>
                <Input
                  onChangeText={(text) => handleChange("cards_amount")(text)}
                  onBlur={handleBlur("cards_amount")}
                  value={values.cards_amount}
                  style={styles.inputField}
                  icon
                  iconName="numeric"
                  inputViewStyle={styles.inputViewStyle}
                  iconColor={"#ccc"}
                  autoCapitalize={"none"}
                  keyboardType="number-pad"
                  placeholder={t("Enter the card amount")}
                />
                {errors.cards_amount && touched.cards_amount && (
                  <Text style={styles.errorText}>{errors.cards_amount}</Text>
                )}
              </View>
            )}
          </Formik>
        </View>

        <CountryPicker
          show={show}
          style={{
            modal: {
              marginTop: 300,
              height: 350,
            },
          }}
          onBackdropPress={() => setShow(false)}
          onRequestClose={() => setShow(false)}
          itemTemplate={(item) => (
            <TouchableOpacity
              onPress={() => {
                setCountryCode(item?.item?.dial_code);
                setCountryFlag(item?.item?.flag);
                setShow(false);
              }}
              style={{ margin: 5, flex: 1, backgroundColor: "white" }}
            >
              <View style={styles.countryContainer}>
                <Text>{item.item.flag}</Text>
                <Text style={{ marginLeft: 15 }}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      <View
        style={[
          styles.buttonContainer,
          {
            backgroundColor: "white",
          },
        ]}
      >
        <Button
          style={styles.button}
          onPress={() => {
            _formik?.current.handleSubmit();
          }}
          isLoading={isLoading}
          disabled={isLoading}
          loaderColor={{ color: "white" }}
        >
          <Text style={styles.buttonText}>{t("Create")}</Text>
        </Button>
      </View>
    </View>)

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  countryContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
  },
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginTop: 15,
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    // marginVertical: 6,
    height: hp(6),

    width: "90%",
    color: "black",
  },
  statusContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
    width: "80%",
    alignSelf: "center",
    // marginHorizontal: 10,
  },
  inputViewStyle: {
    flexDirection: "row",
    width: "100%",

    height: hp(6),
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: hp(1),
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: hp(1),
  },
  button: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),
    height: hp(7),
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonBelow: {
    backgroundColor: tintColorDark,
    borderRadius: hp(1),
    height: hp(4),
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderColor: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
  },
});

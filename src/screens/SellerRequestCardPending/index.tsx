import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Text,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../../../components/Button";
import Header from "../../../components/Header";
import { tintColorDark } from "../../../constants/Colors";
import { useLogoutUserMutation } from "../../../redux/auth/authApiSlice";
import { logOut } from "../../../redux/auth/authSlice";
import { setExpoPushToken } from "../../../redux/user/userSlice";
import { hp } from "../../../utils";

export default function SellerRequestCardPending(props) {
  const _formik = useRef();
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const refreshToken = useSelector((state) => state?.auth?.refreshToken?.token);
  const expoPushToken = useSelector((state) => state?.user?.expoPushToken);
  const [logoutUser, logoutUserResp] = useLogoutUserMutation();

  const logoutApi = async () => {
    const data = {
      refreshToken,
      expoPushToken,
    };
    try {
      const resp = await logoutUser(data);

      dispatch(logOut());
      dispatch(setExpoPushToken(""));

      props.navigation.reset({
        index: 0,
        routes: [{ name: "Signin" }],
      });
    } catch (error) {
      console.log("---error--logout-", error);
    }
  };

  return (

    <View style={{
      flex: 1,
    }}>
      <Header
        title={t("Card Request")}
      />
      <View
        style={{
          flex: 1,
          // justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Image
          style={{
            width: "100%",
            height: "50%",

          }}
          resizeMode="contain"
          source={require("../../../assets/images/pending.png")}
        />

        {/* <Card> */}
        <View>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              fontWeight: "500",
              marginTop: 20,
              padding: 20,
            }}
          >Your card request has been received by our team. You’ll be able to access the app once your cards are shipped</Text>
        </View>
        {/* </Card> */}

        <View style={{
          flex: 1,
          width: '90%',
          justifyContent: 'flex-end'
        }}>
          <MyButton
            style={{
              backgroundColor: tintColorDark,
              borderRadius: hp(5),
              height: hp(7),
              width: "100%",
              justifyContent: "center",
              alignItems: "center",

              marginBottom: hp(3),
            }}
            onPress={() => {

              logoutApi();
            }}
            isLoading={logoutUserResp?.isLoading}
            disabled={logoutUserResp?.isLoading}
            loaderColor={{
              color: "white",
            }}
          >
            <Text style={{
              color: "white",
              fontSize: hp(2),
              fontWeight: "700",
            }}>
              {t("Logout",)}
            </Text>
          </MyButton>
        </View>
      </View>
    </View>

  );
}

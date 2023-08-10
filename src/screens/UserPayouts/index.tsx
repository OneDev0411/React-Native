import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native';
import { Card, Switch } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-root-toast';
import MyButton from '../../../components/Button';
import Header from '../../../components/Header';
import Text from '../../../components/Text';
import {
	useDeletePayoutMethodMutation,
	useGetPayoutMethodQuery,
	useGetPayoutsQuery,
} from '../../../redux/user/userApiSlice';
import { formatDateTime, hp, wp } from '../../../utils';

export default function UserPayouts(props: any) {
	const { t } = useTranslation();
	const focused = useIsFocused();

	const RBSortingSheetRef = useRef();

	const { data: payouts, isError, isLoading, refetch } = useGetPayoutMethodQuery();

	const [sortValue, setSortValue] = useState(true);
	const [sortValueForModal, setSortValueForModal] = useState(true);
	const [page, setPage] = useState(1);
	const [payoutsListData, setPayoutsListData] = useState([]);

	const {
		data: payoutsData,
		isError: pauoutsIsError,
		isLoading: payoutsIsLoading,
		refetch: refetchPayouts,
	} = useGetPayoutsQuery({
		page: page,
		limit: 20,
		sortBy: sortValue ? 'createdAt:asc' : 'createdAt:desc',
	});

	useEffect(() => {
		if (page === 1) {
			setPayoutsListData(
				!!payoutsData && !!payoutsData.results && payoutsData.results.length > 0
					? payoutsData.results
					: []
			);
		} else if (!!payoutsData && !!payoutsData.results && payoutsData.results.length > 0) {
			setPayoutsListData(payoutsListData.concat(payoutsData.results));
		}
	}, [payoutsData]);

	useEffect(() => {
		//REMARK: Refresh List on Flatlist onRefresh
		if (page === 1) {
			refetchPayouts();
		}
	}, [page]);

	useEffect(() => {
		//REMARK: Refresh List on sort modal value change
		refetchPayouts();
	}, [sortValue]);

	const [deletePayoutMethod, deletePayoutMethodResp] = useDeletePayoutMethodMutation();

	const deletePayout = async () => {
		try {
			const resp = await deletePayoutMethod(payouts?.id);

			if (resp) {
				Toast.show(t('Payout method deleted!'), {
					duration: Toast.durations.LONG,
					position: Toast.positions.BOTTOM,
				});
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	//REMARK: Recent Transaction And Sorting View
	const renderRecentTransactionAndSortingView = () => {
		return (
			<View
				style={{
					justifyContent: 'space-between',
					marginTop: 20,
					marginBottom: 5,
					flexDirection: 'row',
				}}
			>
				<View style={{ justifyContent: 'center' }}>
					<Text style={{ fontSize: 22 }}>{t('Recent Transactions')}</Text>
				</View>

				{/* <Icon
          name={"sort"}
          color={"black"}
          size={30}
          onPress={() => {
            setSortValueForModal(sortValue);
            RBSortingSheetRef.current.open();
          }}
        /> */}
			</View>
		);
	};

	const renderPluginActivationSwitch = () => {
		return (
			<View
				style={{
					flex: 1,
					marginTop: 20,
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<View
					style={{
						flex: 0.5,
					}}
				>
					<Text style={[{ fontSize: 18, color: '#000' }]} numberOfLines={1}>
						{'Ascending'}
					</Text>
				</View>
				<View
					style={{
						flex: 0.5,
						alignItems: 'flex-end',
					}}
				>
					<Switch
						value={sortValueForModal}
						onValueChange={(v) => {
							setSortValueForModal(v);
						}}
						color="#2FBC44"
					/>
				</View>
			</View>
		);
	};

	const handleLoadMore = () => {
		if (
			!payoutsIsLoading && !pauoutsIsError && !!payoutsListData && !!payoutsListData
				? payoutsListData.length > 0
				: false
		) {
			setPage(page + 1);
		}
	};
	//REMARK: Recent Transaction Flat List View
	const renderRecentTransactionListView = () => {
		return (
			<View
				style={{
					flex: 1,
				}}
			>
				<FlatList
					data={payoutsListData}
					style={{}}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 10 }}
					renderItem={({ item, index }) => {
						return (
							<View
								style={{
									paddingTop: 10,
								}}
							>
								<View style={{ flexDirection: 'row' }}>
									<View
										style={{
											flex: 0.2,
										}}
									>
										<Icon
											name={
												item?.method == 'cash'
													? 'cash'
													: item?.method == 'bank'
													? 'bank'
													: item?.method == 'crypto'
													? 'bitcoin'
													: 'paypal'
											}
											color={'#ffc000'}
											size={60}
										/>
									</View>

									<View
										style={{ flex: 0.4, padding: 5, alignItems: 'flex-start' }}
									>
										<Text style={{ fontSize: 20 }}>{t('Payout')}</Text>
										<Text
											style={{ fontSize: 14, marginTop: 1, color: '#8D9683' }}
										>
											{formatDateTime(item?.createdAt)}
										</Text>
									</View>

									<View
										style={{
											flex: 0.4,
											alignItems: 'flex-end',
											justifyContent: 'center',
										}}
									>
										<View
											style={{
												borderRadius: 50,
												paddingHorizontal: 10,
												paddingVertical: 3,
											}}
										>
											<Text
												numberOfLines={1}
												style={{
													fontWeight: '600',
													fontSize: 16,
													color: 'green',
												}}
											>
												{item.currency + ' ' + item.amount}
											</Text>
										</View>
									</View>
								</View>

								<View style={styles.divider} />
							</View>
						);
					}}
					keyExtractor={(item, index) => index.toString()}
					refreshControl={
						<RefreshControl
							refreshing={false}
							onRefresh={() => {
								setPage(1);
							}}
						/>
					}
					ListFooterComponent={
						payoutsIsLoading && (
							<Text
								style={{
									color: 'black',
								}}
							>
								Loading more...
							</Text>
						)
					}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.1}
				/>
			</View>
		);
	};

	return (
		<>
			<View style={styles.container}>
				<Header title={t('Payout Methods')} leftButton={() => props.navigation.goBack()} />
				<View
					style={[
						styles.innerContainer,
						{
							flex: 1,
						},
					]}
				>
					{payouts ? (
						<View
							style={{
								flex: 0.97,
							}}
						>
							<Card
								style={{
									backgroundColor: '#FAFAFA',
								}}
							>
								<View
									style={{
										flexDirection: 'row',
										padding: 20,
									}}
								>
									<View
										style={{
											flex: 1,
											paddingRight: 5,
										}}
									>
										<View style={{ flexDirection: 'row' }}>
											<View
												style={{
													height: wp(16),
													width: wp(16),
													justifyContent: 'center',
													alignItems: 'center',
													backgroundColor: '#BDBDBD',
													borderRadius: wp(16),
												}}
											>
												<Image
													style={styles.bankIcon}
													resizeMode="contain"
													source={
														payouts?.method == 'cash'
															? require('../../../assets/images/money.png')
															: payouts?.method == 'bank'
															? require('../../../assets/images/bank.png')
															: payouts?.method == 'crypto'
															? require('../../../assets/images/crypto.jpg')
															: require('../../../assets/images/paypal.png')
													}
												/>
											</View>
											<View
												style={{
													flex: 1,
													flexDirection: 'row',
													justifyContent: 'space-between',
													alignItems: 'center',
													paddingLeft: 10,
												}}
											>
												<View
													style={{
														flex: 1,
													}}
												>
													<Text
														style={{
															fontWeight: '500',
															fontSize: 20,
														}}
													>
														{payouts?.method == 'crypto'
															? 'Anonymous'
															: payouts?.accountHolder}
													</Text>

													{payouts?.method == 'crypto' ? (
														<Text style={styles.bankName}>
															{payouts?.routing}
														</Text>
													) : null}
													<Text
														style={[
															styles.bankName,
															{
																fontSize:
																	payouts?.method == 'crypto'
																		? 12
																		: 16,
															},
														]}
													>
														{payouts?.bankName} - {payouts?.account}
													</Text>
													<Text
														style={{
															fontWeight: '600',
															color: 'green',
														}}
													>
														{payouts?.region}
													</Text>
												</View>
											</View>
										</View>
									</View>
									<View
										style={{
											justifyContent: 'center',
										}}
									>
										<Icon
											name={'delete'}
											color={'#ff6669'}
											size={30}
											onPress={() => {
												Alert.alert(t('Delete payout method'), '', [
													{
														text: 'Cancel',
														onPress: () =>
															console.log('Cancel Pressed'),
														style: 'cancel',
													},
													{
														text: 'Yes',
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
						props?.navigation?.navigate('Settings')
					)}
				</View>

				{/* <RBSheet
          ref={RBSortingSheetRef}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: hp(5),
              borderTopRightRadius: hp(5),
              padding: hp(3),
              backgroundColor: "#fff",
              alignItems: "center",
            },
          }}
        >
          <Text style={{ fontSize: hp(2.75), color: "#ccc" }}>
            {t("Sorting by Date")}
          </Text>

          {renderPluginActivationSwitch()}

          <MyButton
            style={styles.button}
            onPress={() => {
              setSortValue(sortValueForModal);
              RBSortingSheetRef.current.close();
            }}
          >
            <Text style={[styles.buttonText]}>
              {t("Apply")}
            </Text>
          </MyButton>
        </RBSheet> */}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	innerContainer: {
		marginHorizontal: hp(2.5),
		marginTop: 20,
	},
	credsFont: {
		fontWeight: '700',
		fontSize: hp(2),
		color: 'black',
		marginTop: hp(1),
	},
	button: {
		backgroundColor: '#ffc000',
		borderRadius: hp(5),
		height: hp(7),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: hp(3),
	},
	buttonText: {
		color: 'white',
		fontSize: hp(2),
		fontWeight: '700',
	},
	buttonContainer: {
		alignItems: 'center',
		backgroundColor: 'white',
		paddingHorizontal: hp(2.5),
	},
	bankName: {
		fontSize: 12,
		marginTop: 2,
		color: '#757575',
	},
	divider: {
		height: wp(0.2),
		width: '100%',
		backgroundColor: '#DEDEDE',
		marginTop: 10,
	},
	bankIcon: {
		height: wp(10),
		width: wp(10),
	},
});

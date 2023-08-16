import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tintColorDark } from '../constants/Colors';

const TabButtons = ({
	pendingReq,
	pendingReqNum,
	approvedReq,
	approvedReqNum,
	btnActionPendingApprove,
}) => {
	const [currentSelection, setCurrentSelection] = useState('');

	const btnActionSettle = () => {
		if (currentSelection === approvedReq) {
			setCurrentSelection('');
			btnActionPendingApprove('');
		} else {
			setCurrentSelection(approvedReq);
			btnActionPendingApprove(approvedReq);
		}
	};

	const btnActionPending = () => {
		if (currentSelection === pendingReq) {
			setCurrentSelection('');
			btnActionPendingApprove('');
		} else {
			setCurrentSelection(pendingReq);
			btnActionPendingApprove(pendingReq);
		}
	};
	return (
		<View
			style={[
				styles.mainView,
				styles.cardstyle,
				{
					borderColor: '#C8D5E8',
				},
			]}
		>
			<View
				style={[
					styles.mainSubView,
					{
						backgroundColor: currentSelection === pendingReq ? tintColorDark : 'white',
					},
				]}
			>
				<TouchableOpacity onPress={() => btnActionPending()} style={styles.pendingReqtyle}>
					<Text
						style={[
							,
							{
								fontSize: 16,
								color: currentSelection === pendingReq ? 'white' : '#1C2E47',
								textAlign: 'center',
							},
						]}
					>
						{pendingReq}
					</Text>
					<Text
						style={[
							{
								fontSize: 22,
								fontWeight: '700',
								color: currentSelection === pendingReq ? 'white' : '#eb7a7a',
							},
						]}
					>
						{pendingReqNum || 0}
					</Text>
				</TouchableOpacity>
			</View>

			<View style={{ height: '100%', width: 1, backgroundColor: '#D1D1D6' }} />

			<View
				style={[
					styles.approvedReqView,
					{
						backgroundColor: currentSelection === approvedReq ? tintColorDark : 'white',
					},
				]}
			>
				<TouchableOpacity onPress={() => btnActionSettle()} style={styles.approvedReqStyle}>
					<Text
						style={[
							{
								fontSize: 16,
								color: currentSelection === approvedReq ? 'white' : '#1C2E47',
								textAlign: 'center',
							},
						]}
					>
						{approvedReq}
					</Text>
					<Text
						style={[
							{
								fontSize: 22,
								fontWeight: '700',
								color: currentSelection === approvedReq ? 'white' : '#50c35c',
							},
						]}
					>
						{approvedReqNum || 0}
					</Text>
				</TouchableOpacity>
			</View>

			{/* <View style={{ height: '100%', width: 1, backgroundColor: '#D1D1D6' }} /> */}
		</View>
	);
};

const styles = StyleSheet.create({
	cardstyle: {
		backgroundColor: 'white',
		elevation: 2,
		// shadowOffset: {
		//     height: 1,
		//     width: 1
		// },
		shadowColor: '#F3F7FE',
		// shadowOpacity: 1,
		zIndex: 999,
		borderRadius: 10,
	},
	mainView: {
		height: 80,
		borderRadius: 10,
		flexDirection: 'row',
		borderWidth: 0.5,
	},
	mainSubView: {
		flex: 0.5,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
	},
	pendingReqtyle: {
		flex: 1,
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	approvedReqView: {
		flex: 0.5,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
	},
	approvedReqStyle: {
		flex: 1,
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default TabButtons;

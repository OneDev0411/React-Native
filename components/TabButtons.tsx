import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tintColorDark } from '../constants/Colors';

const TabButtons = ({
    pendingFunds,
    pendingFundAmount,
    settledFunds,
    settledFundAmount,
    btnActionPendingSettledOrder,
}) => {

    const [currentSelection, setCurrentSelection] = useState('');

    const btnActionSettle = () => {
        if (currentSelection === settledFunds) {
            setCurrentSelection('')
            btnActionPendingSettledOrder('')
        } else {
            setCurrentSelection(settledFunds)
            btnActionPendingSettledOrder(settledFunds)
        }

    }

    const btnActionPending = () => {

        if (currentSelection === pendingFunds) {
            setCurrentSelection('')
            btnActionPendingSettledOrder('')
        } else {
            setCurrentSelection(pendingFunds)
            btnActionPendingSettledOrder(pendingFunds)
        }
    }
    return (

        <View style={[styles.mainView, styles.cardstyle, {
            borderColor: '#C8D5E8',


        }]}>
            <View style={[styles.mainSubView, {
                backgroundColor: (currentSelection === pendingFunds) ? (tintColorDark) : ('white')
            }]}>
                <TouchableOpacity
                    onPress={() => btnActionPending()}
                    style={styles.pendingFundStyle}>
                    <Text style={[,
                        { fontSize: 16, color: (currentSelection === pendingFunds) ? ('white') : ('#1C2E47'), textAlign: 'center' }]}>
                        {pendingFunds}
                    </Text>
                    <Text style={[{ fontSize: 22, fontWeight: '700', color: (currentSelection === pendingFunds) ? ('white') : ('#eb7a7a') }]}>
                        {pendingFundAmount}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: '100%', width: 1, backgroundColor: '#D1D1D6' }} />

            <View style={[styles.settledFundsView, {
                backgroundColor: (currentSelection === settledFunds) ? (tintColorDark) : ('white')
            }]}>
                <TouchableOpacity
                    onPress={() => btnActionSettle()}
                    style={styles.settledFundsStyle}>
                    <Text style={[{ fontSize: 16, color: (currentSelection === settledFunds) ? ('white') : ('#1C2E47'), textAlign: 'center' }]}>
                        {settledFunds}
                    </Text>
                    <Text style={[{ fontSize: 22, fontWeight: '700', color: (currentSelection === settledFunds) ? ('white') : (tintColorDark) }]}>{settledFundAmount}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* <View style={{ height: '100%', width: 1, backgroundColor: '#D1D1D6' }} /> */}

        </View>

    );
}

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
    pendingFundStyle: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settledFundsView: {
        flex: 0.5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    settledFundsStyle: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default TabButtons;
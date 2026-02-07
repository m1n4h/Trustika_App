import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/ThemeContext';

interface Order {
  id: string;
  orderNumber: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  date: string;
  time: string;
  status: 'IN TRANSIT' | 'PREPARING' | 'DELIVERED';
  statusColor: string;
  amount: string;
}

export default function Orders() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeOrders: Order[] = [
    {
      id: '1',
      orderNumber: '#TRK-8821',
      icon: 'local-shipping',
      iconBgColor: 'rgba(167, 243, 208, 0.4)',
      iconColor: '#14B8A6',
      date: 'Oct 24, 2023',
      time: '2:30 PM',
      status: 'IN TRANSIT',
      statusColor: '#0891B2',
      amount: '$24.50',
    },
    {
      id: '2',
      orderNumber: '#FOD-2930',
      icon: 'restaurant',
      iconBgColor: 'rgba(254, 197, 149, 0.4)',
      iconColor: '#F97316',
      date: 'Oct 24, 2023',
      time: '1:15 PM',
      status: 'PREPARING',
      statusColor: '#06B6D4',
      amount: '$18.90',
    },
  ];

  const completedOrders: Order[] = [
    {
      id: '3',
      orderNumber: '#TRK-8819',
      icon: 'local-shipping',
      iconBgColor: 'rgba(209, 213, 219, 0.4)',
      iconColor: '#9CA3AF',
      date: 'Oct 21, 2023',
      time: '10:45 AM',
      status: 'DELIVERED',
      statusColor: '#10B981',
      amount: '$42.00',
    },
  ];

  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;

  const renderOrderCard = ({ item }: { item: Order }) => (
    <View style={[styles.orderCard, { backgroundColor: colors.sectionBackground }]}>
      <View style={styles.orderContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor }]}>
          <MaterialIcons name={item.icon as any} size={24} color={item.iconColor} />
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.orderHeaderRow}>
            <Text style={[styles.orderNumber, { color: colors.text }]}>{item.orderNumber}</Text>
            <View style={[styles.statusBadge, { backgroundColor: isDarkMode ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.1)' }]}>
              <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
            </View>
          </View>
          <Text style={[styles.orderDateTime, { color: colors.text }]}>
            {item.date} • {item.time}
          </Text>
        </View>
      </View>

      <View style={[styles.orderFooter, { borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.amountLabel, { color: colors.text }]}>TOTAL AMOUNT</Text>
          <Text style={[styles.amount, { color: '#14B8A6' }]}>{item.amount}</Text>
        </View>
        <TouchableOpacity style={[styles.viewDetailsBtn, { backgroundColor: isDarkMode ? 'rgba(20, 184, 166, 0.2)' : 'rgba(20, 184, 166, 0.1)' }]}>
          <Text style={[styles.viewDetailsText, { color: '#14B8A6' }]}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>

        </Text>
      </View>

      {/* TABS */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.sectionBackground }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'active' && [styles.activeTab, { borderBottomColor: '#FF6B6B' }],
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: colors.text,
                fontWeight: activeTab === 'active' ? '700' : '500',
                opacity: activeTab === 'active' ? 1 : 0.5,
              },
            ]}
          >
            Active ({activeOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'completed' && [styles.activeTab, { borderBottomColor: '#FF6B6B' }],
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: colors.text,
                fontWeight: activeTab === 'completed' ? '700' : '500',
                opacity: activeTab === 'completed' ? 1 : 0.5,
              },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* ORDERS LIST */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.ordersContainer}>
          {displayOrders.length > 0 ? (
            <>
              <FlatList
                data={displayOrders}
                renderItem={renderOrderCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              />
              <Text style={[styles.footerText, { color: colors.text }]}>
                Showing orders from the last 3 months
              </Text>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="shopping-cart"
                size={48}
                color={isDarkMode ? '#4B5563' : '#D1D5DB'}
              />
              <Text style={[styles.emptyText, { color: colors.text }]}>No {activeTab} orders</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  ordersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  orderCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderContent: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  orderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderDateTime: {
    fontSize: 13,
    opacity: 0.7,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  viewDetailsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
});

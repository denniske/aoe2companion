import React from 'react';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useTranslation } from '@app/helper/translate';
import { Linking, Text, View } from 'react-native';
import { ScrollView } from '@app/components/scroll-view';

const GAME = (Constants.expoConfig?.scheme as string) || '';

const LinkText = ({ url, children }: { url: string; children: string }) => (
    <Text
        className="text-blue-500 underline"
        onPress={() => Linking.openURL(url)}
    >
        {children}
    </Text>
);

export default function PrivacyPage() {
    const getTranslation = useTranslation();
    return (
        <ScrollView className="flex-1 bg-white px-4 py-6">
            <Stack.Screen options={{ title: getTranslation('privacy.title') }} />

            <Text className="text-sm text-gray-600 mb-4">
                Effective date: October 03, 2019
            </Text>

            <Text className="text-base text-gray-800 mb-4">
                {GAME} ("us", "we", or "our") operates the {GAME} mobile application
                (hereinafter referred to as the "Service").
            </Text>

            <Text className="text-base text-gray-800 mb-4">
                This page informs you of our policies regarding the collection, use, and
                disclosure of personal data when you use our Service and the choices you
                have associated with that data. The Privacy Policy for {GAME} has been
                created with the help of{" "}
                <LinkText url="https://www.termsfeed.com/">TermsFeed</LinkText>.
            </Text>

            <Text className="text-base text-gray-800 mb-6">
                We use your data to provide and improve the Service. By using the Service,
                you agree to the collection and use of information in accordance with this
                policy.
            </Text>

            {/* Definitions */}
            <Text className="text-xl font-bold mb-3">Definitions</Text>

            <View className="mb-4 space-y-2">
                <Text className="font-semibold">Service</Text>
                <Text className="text-gray-700">
                    Service is the {GAME} mobile application operated by {GAME}
                </Text>

                <Text className="font-semibold">Personal Data</Text>
                <Text className="text-gray-700">
                    Personal Data means data about a living individual who can be identified
                    from those data.
                </Text>

                <Text className="font-semibold">Usage Data</Text>
                <Text className="text-gray-700">
                    Usage Data is data collected automatically from the Service.
                </Text>

                <Text className="font-semibold">Cookies</Text>
                <Text className="text-gray-700">
                    Cookies are small files stored on your device.
                </Text>
            </View>

            {/* Information Collection */}
            <Text className="text-xl font-bold mb-3">
                Information Collection and Use
            </Text>

            <Text className="text-base text-gray-800 mb-4">
                We collect several different types of information for various purposes to
                provide and improve our Service.
            </Text>

            <Text className="text-lg font-semibold mb-2">
                Types of Data Collected
            </Text>

            <Text className="text-base font-semibold mb-1">Personal Data</Text>
            <Text className="text-gray-700 mb-2">
                While using our Service, we may ask you to provide certain personally
                identifiable information.
            </Text>

            <Text className="ml-2 text-gray-700 mb-4">
                • Cookies and Usage Data
            </Text>

            <Text className="text-base font-semibold mb-1">Usage Data</Text>
            <Text className="text-gray-700 mb-4">
                We may collect information such as device type, unique device ID, IP
                address, operating system, and diagnostics.
            </Text>

            {/* Cookies */}
            <Text className="text-base font-semibold mb-1">
                Tracking & Cookies Data
            </Text>
            <Text className="text-gray-700 mb-2">
                We use cookies and similar tracking technologies to track activity on our
                Service.
            </Text>

            <Text className="text-gray-700 mb-2">
                Examples of Cookies we use:
            </Text>

            <Text className="ml-2 text-gray-700">• Session Cookies</Text>
            <Text className="ml-2 text-gray-700">• Preference Cookies</Text>
            <Text className="ml-2 text-gray-700 mb-4">• Security Cookies</Text>

            {/* Google OAuth */}
            <Text className="text-base font-semibold mb-1">
                Google OAuth / YouTube Account
            </Text>
            <Text className="text-gray-700 mb-4">
                The Service allows users to optionally connect their Google account to
                display a YouTube badge and channel link.
            </Text>

            <Text className="font-semibold mb-1">Data Accessed from Google</Text>
            <Text className="ml-2 text-gray-700">• YouTube channel ID</Text>
            <Text className="ml-2 text-gray-700">• YouTube channel name</Text>
            <Text className="ml-2 text-gray-700 mb-4">
                • Public YouTube channel URL
            </Text>

            <Text className="font-semibold mb-1">Use of Google / YouTube Data</Text>
            <Text className="text-gray-700 mb-4">
                Data is used exclusively to display a YouTube badge and profile link.
            </Text>

            <Text className="font-semibold mb-1">Data Retention</Text>
            <Text className="text-gray-700 mb-4">
                YouTube data is stored only while the account connection is active.
            </Text>

            <Text className="font-semibold mb-1">Data Deletion</Text>
            <Text className="text-gray-700 mb-4">
                Users may delete their Google / YouTube data at any time by clicking the "Unlink Youtube Account" button in the Account Page.
            </Text>

            {/* Use of Data */}
            <Text className="text-xl font-bold mb-3">Use of Data</Text>
            <Text className="ml-2 text-gray-700">• Provide and maintain the Service</Text>
            <Text className="ml-2 text-gray-700">• Customer support</Text>
            <Text className="ml-2 text-gray-700">• Improve the Service</Text>
            <Text className="ml-2 text-gray-700 mb-4">
                • Detect and prevent technical issues
            </Text>

            {/* Security */}
            <Text className="text-xl font-bold mb-3">Security of Data</Text>
            <Text className="text-gray-700 mb-4">
                While we strive to protect your data, no method of transmission is 100%
                secure.
            </Text>

            {/* Links */}
            <Text className="text-xl font-bold mb-3">Links to Other Sites</Text>
            <Text className="text-gray-700 mb-4">
                We are not responsible for the privacy practices of third-party sites.
            </Text>

            {/* Children */}
            <Text className="text-xl font-bold mb-3">Children's Privacy</Text>
            <Text className="text-gray-700 mb-4">
                Our Service does not address anyone under the age of 18.
            </Text>

            {/* Changes */}
            <Text className="text-xl font-bold mb-3">
                Changes to This Privacy Policy
            </Text>
            <Text className="text-gray-700 mb-4">
                We may update this policy from time to time.
            </Text>

            {/* Contact */}
            <Text className="text-xl font-bold mb-3">Contact Us</Text>
            <Text className="text-gray-700">
                By email: hello@{GAME}.com
            </Text>
        </ScrollView>
    );
}



import React, { useEffect } from 'react';
import * as Haptics from 'expo-haptics';

import RavenCallCard from '../components/RavenCallCard';
import { useAlert } from '../Context/AlertContext';

export default function RavenCallHandler() {
  const { alertData, clearAlert } = useAlert();

  const isVisible = !!alertData;
  const affectedUser = alertData?.issuedBy;
  const location = alertData?.location;

  useEffect(() => {
    if (isVisible) {

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <RavenCallCard
          isVisible={isVisible}
          onClose={clearAlert}
          location={location}
          user={affectedUser}
        />
      )}
    </>
  );
}

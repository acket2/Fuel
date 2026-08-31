import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { OrderSection } from '../components/OrderSection';

interface OrderContext {
  setTelegramSettingsOpen: (open: boolean) => void;
}

export default function OrderPage() {
  const { setTelegramSettingsOpen } = useOutletContext<OrderContext>();

  return (
    <>
      <OrderSection
        onOpenTelegramSettings={() => setTelegramSettingsOpen(true)}
      />
    </>
  );
}

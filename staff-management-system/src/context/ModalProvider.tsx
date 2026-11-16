"use client";
import React, { createContext, useContext, useState } from "react";
import CustomModal from "@/components/ui/CustomModal";

interface ModalContextType {
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  const openModal = (content: React.ReactNode) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalContent && (
        <CustomModal open={!!modalContent} handleClose={closeModal}>
          {modalContent}
        </CustomModal>
      )}
    </ModalContext.Provider>
  );
};

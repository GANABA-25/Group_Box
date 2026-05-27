import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const ModalCmp = ({ open, onClose, children }) => {
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white shadow-xl p-4 font-Montserrat-Regular rounded-xl">
          {children}
        </Box>
      </Modal>
    </div>
  );
};

export default ModalCmp;

import Modal from "react-modal";
import "../assets/style/Modal.css"

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmation de suppression"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h2>Confirmation de suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <button onClick={onRequestClose} className="btnCancel">Non</button>
            <button onClick={onConfirm} className="btnConfirm">Oui</button>

        </Modal>
    );
};

export default ConfirmationModal;
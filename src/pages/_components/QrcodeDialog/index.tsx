// import React, { useState } from 'react';
// import Modal from 'react-modal';

// Modal.setAppElement('#__docusaurus');

// const SimpleModal = () => {
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   const openModal = () => {
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//   };

//   return (
//     <div>
//       <button onClick={openModal}  className="button button--warning"> 打赏 💸🙌🌟 </button>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="简单弹窗"
//         style={{
//           overlay: {
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           },
//           content: {
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: '400px',
//             height: '200px',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             padding: '20px',
//             borderRadius: '4px',
//           },
//         }}
//       >
//         <h2>这是一个简单的弹窗</h2>
//         <p>这里是弹窗的内容</p>
//         <button onClick={closeModal}>关闭弹窗</button>
//       </Modal>
//     </div>
//   );
// };

// export default SimpleModal;
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__docusaurus');

const SimpleModal = ({ modalIsOpen, toggleModal }) => {
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        contentLabel="简单弹窗"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '4px',
            backgroundColor: 'black', // 设置弹窗背景为黑色
            border: '1px solid black', // 设置弹窗边框
          },
        }}
      >
        <img src="img/zsm.jpg" alt="示例图片" style={{ width: '100%', height: 'auto' }} />
        {/* <button onClick={toggleModal}>关闭弹窗</button> */}
      </Modal>
    </div>
  );
};

export default SimpleModal;

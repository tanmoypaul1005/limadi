import React from 'react';
import CommonModal from '../modal/CommonModal';


const ImageUploadViewModal2 = ({ src, show_modal, setShowModal }) => {


  return (
    <div>
      <CommonModal
        showModal={show_modal}
        setShowModal={setShowModal}
        modalTitle="Image Preview"
        mainContent={
          <div className='mt-s20'>
            <img src={src} alt="" className="w-full h-[500px] object-cover" />
          </div>
        }

      />
    </div>
  );
};

export default ImageUploadViewModal2;
import React from 'react';
import { base_url_src } from '../../app/utility/const';
import { iNoImage } from '../../app/utility/imageImports';
import CommonModal from '../modal/CommonModal';


const ImageViewerModal = ({ showModal, setShowModal, src = null }) => {

  return (
    <>
      <CommonModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalTitle=""
        mainContent={
          <div className='mt-s20 w-full flex flex-row justify-center h-auto'>
            <img
              src={src ? (base_url_src + src) : iNoImage}
              alt="img"
              className="object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = iNoImage; }}
            />
          </div>
        }
      />
    </>
  );
};

export default ImageViewerModal;
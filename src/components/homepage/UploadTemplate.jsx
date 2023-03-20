// import React, { useEffect } from 'react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ConfirmYesNo from './ConfirmYesNo.jsx';
import { createID } from '../../utils/helper';

const UploadTemplate = props => {
  const [openUpdateBox, setOpenUpdateBox] = useState(false);
  const [template, setTemplate] = useState({});
  const [existingUID, setExistingUID] = useState('');
  const onReaderLoad = event => {
    const file = JSON.parse(event.target.result);
    setExistingUID(file.TemplateContainer.uid);
    setTemplate(file);
  };

  const onChange = event => {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  };

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <>
          <p>Upload the template you want to edit:</p>
          <input id="upload-input" type="file" onChange={onChange} />
        </>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            // The following lines open a configurable yes/no dialog. After the user
            // clicks on something in the yes/no dialog, the yes/no dialog calls the
            // methods props.onUpload and props.setUID.
            // props.onUpload closes this dialog and updates the template.
            // props.setUID tells App.js the new UID, and App.js passes the new UID to
            // everywhere where it's needed.
            if (existingUID !== '') {
              setOpenUpdateBox(true);
            }
          }}
          color="primary"
          autoFocus
        >
          DONE
        </Button>
        <Button onClick={props.onCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>

      <ConfirmYesNo
        open={openUpdateBox}
        onYes={() => {
          props.onUpload(template);
          props.setUID(existingUID);
          setExistingUID('');
          setOpenUpdateBox(false);
        }}
        onNo={() => {
          props.onUpload(template);
          // The following line re-generates the template's UID.
          // Without it, if you upload a template with UID 12345, choose yes,
          // then re-upload the same template and choose no,
          // you will still end up with UID 12345.
          // TODO: Only run the following line if the current UID matches
          // the uploaded template's UID.
          props.setUID(createID());
          setExistingUID('');
          setOpenUpdateBox(false);
        }}
        text="Do you want to update the existing template?"
        yesText="Yes"
        noText="No"
      />
    </Dialog>
  );
};

export default UploadTemplate;

UploadTemplate.propTypes = {
  onCancel: PropTypes.func,
  open: PropTypes.bool,
  onUpload: PropTypes.func,
  setUID: PropTypes.func
};

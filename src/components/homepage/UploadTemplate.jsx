// import React, { useEffect } from 'react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const UploadTemplate = props => {
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
            props.onUpload(template);
            if (
              existingUID !== '' &&
              // Todo: Instead of using window.confirm, make a
              // custom confirm box, along the lines of:
              // ______________________________________
              // | Do you want to update the uploaded |
              // |              template?             |
              // |  _____ __________________________  |
              // |  |Yes| |No (create new template)|  |
              // |  ````` ``````````````````````````  |
              // ``````````````````````````````````````
              window.confirm('Do you want to update the uploaded template?')
            ) {
              props.setUID(existingUID);
            }
            setExistingUID('');
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

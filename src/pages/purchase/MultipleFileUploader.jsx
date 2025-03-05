import React, { useState } from 'react';
import { Box, Paper, Typography, Button, IconButton, Card, CardContent, Collapse , CircularProgress} from '@mui/material';
import { Download, ExpandMore, ExpandLess, InsertDriveFile, Add , Close } from '@mui/icons-material';
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import api from '@/lib/axios';

// Register FilePond plugins
registerPlugin(FilePondPluginFileValidateType);

const FileDisplay = ({ files, onRemove }) => {
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);


  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (fileId) => {
    try {
        setDeletingFileId(fileId);
      const response = await api.post(`/attachments/${fileId}`);
      
      if (response.data.status === 'success') {
        // Call the parent's onRemove to update the state
        onRemove(fileId);
      } else {
        // Handle error - you might want to show a notification or alert
        console.error('Failed to delete attachment');
      }
    } catch (error) {
     setDeletingFileId(null);
      console.error('Error deleting attachment:', error);
    } finally {
        setDeletingFileId(null);
      }

  };

  const handleFileClick = async (file) => {
    try {
      // Get the file using your API
      const response = await api.get(`/storage/${file.file_path}`, {
        responseType: 'blob'  // Important: this tells axios to treat the response as a blob
      });

      // Create a blob URL from the response
      const blob = new Blob([response.data], { type: file.file_type });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = file.file_name; // Use the original file name
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Collapse in={!showAllFiles} collapsedSize={75}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {files.map((file, index) => (
            <Card
              onClick={() => handleFileClick(file)}
              key={file.id || index}
              sx={{ 
                width: 100, 
                overflow: 'visible',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '& .download-overlay': {
                    opacity: 1,
                  },
                  '& .file-icon': {
                    opacity: 0,
                  }
                }
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": { pb: 1.5 },
                  overflow: "visible",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <InsertDriveFile className="file-icon"
                    sx={{ 
                      fontSize: 20,
                      color: 'action.active',
                      transition: 'opacity 0.2s ease',

                    }} 
                     color="action" />
                  <Box
                    className="download-overlay"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 11,
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      width: '20px',
                      height: '20px',
                    }}
                  >
                    <Download sx={{ fontSize: 23, color: 'primary.main' }} />
                  </Box>
                  <IconButton
                    size="small"
                    disabled={deletingFileId === file.id}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking delete
                        handleDelete(file.id);
                      }}
                    sx={{
                      borderRadius: 100,
                      position: "absolute",
                      top: -6,
                      right: -6,
                      backgroundColor: "#E5E4E2",
                    }}
                  >
                    <Box>
                      {" "}
                      {deletingFileId === file.id ? (
                        <CircularProgress size="15px" />
                      ) : (
                        <Close sx={{ fontSize: 20 }} />
                      )}
                    </Box>
                  </IconButton>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    fontSize: "0.75rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.file_name}
                </Typography>
                {file.file_size && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {formatFileSize(file.file_size)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Collapse>

      {files.length > 3 && (
        <Button
          fullWidth
          size="small"
          endIcon={showAllFiles ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setShowAllFiles(!showAllFiles)}
          sx={{ mt: 1 }}
        >
          {showAllFiles ? "Show Less" : "Show More"}
        </Button>
      )}
    </Box>
  );
};

const FileUploader = ({ uploadedFiles = [], onFilesChange, referenceNumber, modelType }) => {
    const [files, setFiles] = useState([]);
    const [showUploader, setShowUploader] = useState(false);
  
    const handleUpdateFiles = (fileItems) => {
      // Only update FilePond's internal state
      setFiles(fileItems);
    };

    const handleRemoveFile = (fileId) => {
        // Update the uploadedFiles state by filtering out the deleted file
        const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
        onFilesChange(updatedFiles, 'replace');
      };
  
    return (
      <Box sx={{ maxWidth: '100%', p: 0, position: 'relative' }}>
        <Paper elevation={1} sx={{ p: 1 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              Uploaded Attachment
              <IconButton 
                onClick={() => setShowUploader(!showUploader)}
                sx={{ ml: 1 }}
              >
                <Add />
              </IconButton>
            </Typography>
          </Box>
  

          <FileDisplay 
            files={uploadedFiles} 
            onRemove={handleRemoveFile} 
          />
        </Paper>
  
        <Paper 
          elevation={3} 
          sx={{ 
            visibility: showUploader ? "visible" : "hidden",
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 24,
            mt: 1.2,
            p: 2,
            zIndex: 1000,
            width: '100%',
            backgroundColor: 'background.paper'
          }}
        >
          <FilePond
            files={files}
            onupdatefiles={handleUpdateFiles}
            allowMultiple={true}
            maxFiles={10}
            name="attachments"
            labelIdle='Upload Attachment'
            acceptedFileTypes={[
                "image/*",
                "application/pdf",
                "application/msword", 
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                "application/vnd.ms-excel", 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                "application/vnd.oasis.opendocument.text", 
                "application/vnd.oasis.opendocument.spreadsheet" 
              ]}
            server={{
              process: async (fieldName, file, metadata, load, error, progress) => {
                try {
                  
                  const formData = new FormData();
                  formData.append('attachments[]', file);
  
                  let uploadUrl = '';
                  switch (modelType) {
                    case 'purchase-orders':
                      uploadUrl = `/purchase-orders/${referenceNumber}/attachments`;
                      break;
                      case 'receiving-reports':
                      uploadUrl = `/receiving-reports/${referenceNumber}/attachments`;  
                      break;
                  }
  
                  const response = await api.post(uploadUrl, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (e) => {
                      progress(e.lengthComputable, e.loaded, e.total);
                    },
                  });
  
                  if (response.data.status === 'success') {
                    const uploadedFile = response.data.data.attachments[0];
                    load(uploadedFile.id);
                    // Only update parent's state after successful upload
                    if (onFilesChange) {
                        console.log(uploadedFile);
                      onFilesChange([uploadedFile]);
                    }
                    // Clear FilePond's state
                    setFiles([]);
                  } else {
                    error('Upload failed');
                  }
                } catch (err) {
                  error('Upload failed');
                  console.error('Upload error:', err);
                } 
              }
            }}
            stylePanelLayout="compact"
            styleLoadIndicatorPosition="center bottom"
            styleProgressIndicatorPosition="right bottom"
            styleButtonRemoveItemPosition="left bottom"
            styleButtonProcessItemPosition="right bottom"
          />
        </Paper>
      </Box>
    );
  };

export default FileUploader;
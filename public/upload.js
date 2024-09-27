document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const progressBar = document.getElementById('progressBar');
    const statusDiv = document.getElementById('status');
    const formData = new FormData();
    
    const title = document.getElementById('title').value;
    const musicFile = document.getElementById('musicFile').files[0];
  
    formData.append('title', title);
    formData.append('musicFile', musicFile);
  
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', function(e) {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        progressBar.style.display = 'block';
        progressBar.value = percentComplete;
      }
    });
  
    xhr.upload.addEventListener('load', function() {
      progressBar.value = 100;
      statusDiv.innerHTML = 'Upload complete!';
      setTimeout(function() {
        window.location.href = '/'; 
      }, 2000); 
    });
  
    xhr.upload.addEventListener('error', function() {
      statusDiv.innerHTML = 'Upload failed. Please try again.';
    });
  
    xhr.open('POST', '/upload', true);
    xhr.send(formData);
  });
  
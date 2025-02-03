// Mobile Menu
document.getElementById('menu-icon').addEventListener('click', () => {
  document.querySelector('.navbar').classList.toggle('active');
});

// DOM Elements
const dropZone = document.getElementById('dropZone');
const previewGrid = document.getElementById('previewGrid');
const fileInput = document.getElementById('fileInput');

// Numbers API Call
$(document).ready(function() {
  $.ajax({
    url: 'https://numbersapi.com/1/30/date?json',
    success: function(data) {
      $('.fact-text').text(data.text || "Stay motivated with daily fitness facts!");
    },
    error: () => {
      $('.fact-text').text("Regular exercise boosts cognitive function!");
    }
  });
});

// Notification System
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// File Validation
const isValidFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;
  
  if (!file) {
    showNotification('No file selected!', 'error');
    return false;
  }
  
  if (!validTypes.includes(file.type)) {
    showNotification(`Unsupported format: ${file.type}`, 'error');
    return false;
  }
  
  if (file.size > maxSize) {
    showNotification(`File too large: ${(file.size/1024/1024).toFixed(2)}MB`, 'error');
    return false;
  }
  
  return true;
};

// Preview Management
const addPreview = (file) => {
  const reader = new FileReader();
  
  reader.onloadstart = () => {
    dropZone.classList.add('loading');
  };
  
  reader.onload = (e) => {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.className = 'preview-image';
    
    if (previewGrid.children.length >= 5) {
      previewGrid.removeChild(previewGrid.firstElementChild);
    }
    
    previewGrid.appendChild(img);
    dropZone.classList.remove('loading');
  };
  
  reader.onerror = () => {
    showNotification('Error reading file', 'error');
    dropZone.classList.remove('loading');
  };
  
  reader.readAsDataURL(file);
};

// File Upload Handler
const handleFileUpload = (files) => {
  if (!files || files.length === 0) return;
  
  const file = files[0];
  if (!isValidFile(file)) return;
  
  // Show preview
  addPreview(file);
  
  // Prepare upload
  const formData = new FormData();
  formData.append('image', file);
  
  // Upload to server
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then(data => {
    console.log("Server Response:", data);
    if (data.success) {
      showNotification('Upload successful!', 'success');
    } else {
      showNotification(`Upload failed: ${data.error}`, 'error');
    }
  })
  .catch(error => {
    console.error('Upload error:', error);
    showNotification(`Upload failed: ${error.message}`, 'error');
  });
};

// Event Listeners
fileInput.addEventListener('change', (e) => {
  handleFileUpload(e.target.files);
  e.target.value = ''; // Reset input
});

// Drag & Drop Handlers
['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
  });
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  handleFileUpload(e.dataTransfer.files);
});

// Navigation Link Handler
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('This feature is not implemented yet!', 'error');
  });
});
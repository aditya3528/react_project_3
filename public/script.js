let currentUserRole = null;
let currentUsername = null;

async function fetchMe() {
  const res = await fetch('/api/auth/me', {
    credentials: 'include'
  });

  if (res.ok) {
    const data = await res.json();
    currentUserRole = data.role;
    currentUsername = data.username;

    const userInfo = document.getElementById('userInfo');
    if (currentUserRole === 'admin' || currentUserRole === 'editor') {
      userInfo.innerHTML = `<p><strong>Logged in as:</strong> ${currentUsername} (${currentUserRole.toUpperCase()})</p>`;
    } else {
      userInfo.innerHTML = '';
    }
  } else {
    location.href = '/login.html';
  }
}

async function fetchPosts() {
  await fetchMe(); // Fetch role before showing buttons

  const res = await fetch('/api/posts', {
    credentials: 'include'
  });

  if (!res.ok) {
    location.href = '/login.html';
    return;
  }

  const posts = await res.json();
  const container = document.getElementById('posts');
  container.innerHTML = '';

  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <p><strong>Written by:</strong> ${post.user?.username || 'Unknown'}</p>
      ${
        currentUserRole === 'admin'
          ? `<button onclick="deletePost('${post._id}')">Delete</button>`
          : ''
      }
      ${
        currentUserRole === 'admin' || currentUserRole === 'editor'
          ? `<button onclick="showEditForm('${post._id}', \`${post.title}\`, \`${post.content}\`)">Edit</button>`
          : ''
      }
    `;
    container.appendChild(div);
  });
}

document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, content })
  });

  document.getElementById('title').value = '';
  document.getElementById('content').value = '';
  fetchPosts();
});

async function deletePost(id) {
  await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  fetchPosts();
}

async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
  location.href = '/login.html';
}

let editPostId = null;

function showEditForm(id, title, content) {
  document.getElementById('editForm').style.display = 'block';
  document.getElementById('editTitle').value = title;
  document.getElementById('editContent').value = content;
  editPostId = id;
}

function cancelEdit() {
  document.getElementById('editForm').style.display = 'none';
  document.getElementById('editTitle').value = '';
  document.getElementById('editContent').value = '';
  editPostId = null;
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('editTitle').value;
  const content = document.getElementById('editContent').value;

  await fetch(`/api/posts/${editPostId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, content })
  });

  cancelEdit();
  fetchPosts();
});

fetchPosts();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-form');
  const userList = document.getElementById('user-list');
  const repoList = document.getElementById('repos-list');
  const toggleButton = document.getElementById('toggle-search');

  let searchType = 'users'; // نوع البحث الافتراضي

  toggleButton.addEventListener('click', () => {
    searchType = searchType === 'users' ? 'repos' : 'users';
    toggleButton.textContent = searchType === 'users' ? 'Search Repos' : 'Search Users';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // منع إعادة تحميل الصفحة
    const searchQuery = document.getElementById('search').value.trim();
    
    if (searchQuery === '') return; // التأكد من عدم إرسال بحث فارغ

    // مسح النتائج السابقة
    userList.innerHTML = '';
    repoList.innerHTML = '';

    if (searchType === 'users') {
      searchUsers(searchQuery);
    } else {
      searchRepos(searchQuery);
    }
  });

  function searchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => response.json())
    .then(data => displayUsers(data.items))
    .catch(error => console.error('Error:', error));
  }

  function displayUsers(users) {
    users.forEach(user => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" width="50">
        <a href="${user.html_url}" target="_blank">${user.login}</a>
        <button data-username="${user.login}">View Repos</button>
      `;
      userList.appendChild(li);

      // إضافة حدث عند الضغط على الزر لفتح رابط المستودعات
      li.querySelector('button').addEventListener('click', (event) => {
        const username = event.target.getAttribute('data-username');
        window.location.href = `https://github.com/${username}?tab=repositories`;
      });
    });
  }

  function searchRepos(query) {
    fetch(`https://api.github.com/search/repositories?q=${query}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => response.json())
    .then(data => displayRepos(data.items))
    .catch(error => console.error('Error:', error));
  }

  function displayRepos(repos) {
    // مسح قائمة المستودعات قبل إضافة جديدة
    repoList.innerHTML = '';
    
    repos.forEach(repo => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
      repoList.appendChild(li);
    });
  }
});

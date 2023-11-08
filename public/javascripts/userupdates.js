const userUpdates = <%- JSON.stringify(user.updates) %>;

const filterData = (timeOption) => {
  const today = new Date();
  switch (timeOption) {
    case 'today':
      return userUpdates.filter(item => new Date(item.createdAt).toDateString() === today.toDateString());
    case 'thisWeek':
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      return userUpdates.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
      });
    case 'thisMonth':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return userUpdates.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
      });
    case 'thisYear':
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      return userUpdates.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startOfYear && itemDate <= endOfYear;
      });
    case 'all':
    default:
      return userUpdates;
  }
};

    const timeFilter = document.getElementById('timeFilter');
    const filteredUpdates = document.getElementById('filteredUpdates');

    timeFilter.addEventListener('change', (event) => {
      const selectedOption = event.target.value;
      const filteredData = filterData(selectedOption);
      filteredUpdates.innerHTML = '';
      filteredData.reverse().forEach(update => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <p>Project: ${update.title}</p>
          <p>Project Description: ${update.desc}</p>
          <p>Date: ${new Date(update.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
          <p>Time of update: ${new Date(update.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
        `;
        filteredUpdates.appendChild(div);
      });
    });
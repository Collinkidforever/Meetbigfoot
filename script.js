document.addEventListener('DOMContentLoaded', function () {
    openTab('home');

    var map = L.map('mapContainer').setView([37.8, -96], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    var markers = L.markerClusterGroup();
    map.addLayer(markers);

    document.getElementById('sightingForm').addEventListener('submit', function (e) {
        e.preventDefault();
        
        var location = document.getElementById('location').value;
        var description = document.getElementById('description').value;
        var date = document.getElementById('date').value;
        var time = document.getElementById('time').value;
        var image = document.getElementById('image').files[0];

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = data[0].lat;
                    var lon = data[0].lon;

                    var marker = L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${location}</b><br>${description}<br>${date} ${time}`);
                    markers.addLayer(marker);

                    if (image) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var imgElement = document.createElement('img');
                            imgElement.src = e.target.result;
                            imgElement.style.maxWidth = '100px';
                            imgElement.style.height = 'auto';
                            marker.bindPopup(`<b>${location}</b><br>${description}<br>${date} ${time}<br><img src="${e.target.result}" style="max-width: 100px; height: auto;">`).openPopup();
                            document.getElementById('galleryContainer').appendChild(imgElement);
                        };
                        reader.readAsDataURL(image);
                    }

                    document.getElementById('listContainer').innerHTML += `<div><b>${location}</b><br>${description}<br>${date} ${time}</div>`;
                    document.getElementById('sightingForm').reset();
                } else {
                    alert('Location not found.');
                }
            })
            .catch(error => console.error('Error:', error));
    });
});

function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    var tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}
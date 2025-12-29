        // Initialize the map
        const map = L.map('map').setView([50.0, 10.0], 6);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // List of available zip files
        const zipFileNames = [
            'N41E000-009.zip', 'N41E010-019.zip',
            'N42E000-009.zip', 'N42E010-019.zip',
            'N43E000-009.zip', 'N43E010-019.zip',
            'N44E000-009.zip', 'N44E010-019.zip',
            'N45E000-009.zip', 'N45E010-019.zip',
            'N46E000-009.zip', 'N46E010-019.zip',
            'N47E000-009.zip', 'N47E010-019.zip',
            'N48E000-009.zip', 'N48E010-019.zip',
            'N49E000-009.zip', 'N49E010-019.zip',
            'N50E000-009.zip', 'N50E010-019.zip',
            'N51E000-009.zip', 'N51E010-019.zip',
            'N52E000-009.zip', 'N52E010-019.zip',
            'N53E000-009.zip', 'N53E010-019.zip',
            'N54E000-009.zip', 'N54E010-019.zip',
            'N55E000-009.zip', 'N55E010-019.zip',
            'N56E000-009.zip', 'N56E010-019.zip',
            'N57E000-009.zip', 'N57E010-019.zip',
            'N58E000-009.zip', 'N58E010-019.zip',
            'N59E000-009.zip', 'N59E010-019.zip',
            'N60E000-009.zip', 'N60E010-019.zip',
            'N31E010-019.zip', 'N35W000-009.zip',
            'N33E010-019.zip', 'N39W000-009.zip',  
            'N36E010-019.zip', 'N47W000-009.zip',
            'N41W000-009.zip', 'N32E010-019.zip', 
            'N45W000-009.zip', 'N34W000-009.zip', 
            'N31W000-009.zip', 'N37W000-009.zip', 
            'N33W000-009.zip', 'N43W000-009.zip', 
            'N36W000-009.zip', 'N48W000-009.zip',
            'N39E010-019.zip', 'N32W000-009.zip',  
            'N42W000-009.zip', 'N35E010-019.zip', 
            'N46W000-009.zip', 'N38E010-019.zip',
            'N34E010-019.zip', 'N40E010-019.zip',      
            'N37E010-019.zip', 'N49W000-009.zip',
            'N38W000-009.zip', 'N40W000-009.zip',             
            'N44W000-009.zip', 'N50W000-009.zip',       

            // 'N21W000-009.zip', 
            'N22W010-019.zip', 
            // 'N24W000-009.zip', 
            'N25W010-019.zip',
            'N27W000-009.zip', 
            'N28W010-019.zip', 
            'N30W000-009.zip',
            'N21W010-019.zip', 
            // 'N23W000-009.zip', 
            'N24W010-019.zip',
            // 'N26W000-009.zip',
            'N27W010-019.zip', 
            'N29W000-009.zip', 
            'N30W010-019.zip',
            // 'N22W000-009.zip', 
            'N23W010-019.zip', 
            // 'N25W000-009.zip', 
            'N26W010-019.zip',
            'N28W000-009.zip', 
            'N29W010-019.zip',

 
        ];

        // Function to parse filename and extract coordinates
        function parseZipFileName(filename) {
            // Pattern: N{lat}[E|W]{lonStart}-{lonEnd}.zip
            const match = filename.match(/^N(\d+)([EW])(\d+)-(\d+)\.zip$/);
            if (!match) {
                console.error('Invalid filename pattern:', filename);
                return null;
            }

            const lat = parseInt(match[1]);
            const hemisphere = match[2]; // 'E' or 'W'
            const lonStart = parseInt(match[3]);    // 000 or 010
            const lonEnd = parseInt(match[4]);      // 009 or 019

            // Convert to actual longitude values
            let actualLonStart, actualLonEnd;
            if (hemisphere === 'W') {    
              actualLonStart = -(lonEnd + 1);  // W010-019 means -20 to -10
                actualLonEnd = -lonStart;

            } else {
                // East coordinates are positive
                actualLonStart = lonStart;
                actualLonEnd = lonEnd + 1;
            }

            // Determine type based on hemisphere and range
            let type;
            if (hemisphere === 'W') {
                type = 'western_negative';
            } else {
                type = lonStart < 10 ? 'western' : 'eastern';
            }

            return {
                name: filename,
                latStart: lat,
                latEnd: lat + 1,  // Each file covers 1 degree latitude
                lonStart: actualLonStart,
                lonEnd: actualLonEnd,
                type: type
            };
        }

        // Generate zip files array dynamically
        const zipFiles = zipFileNames.map(parseZipFileName).filter(file => file !== null);

        // Function to get color based on type
        function getColor(type) {
            switch(type) {
                case 'western': return 'rgba(255, 0, 0, 0.3)';           // Red for E000-009
                case 'eastern': return 'rgba(0, 0, 255, 0.3)';           // Blue for E010-019
                case 'western_negative': return 'rgba(0, 255, 0, 0.3)';  // Green for W coordinates
                default: return 'rgba(128, 128, 128, 0.3)';              // Gray fallback
            }
        }

        function getBorderColor(type) {
            switch(type) {
                case 'western': return '#ff0000';           // Red for E000-009
                case 'eastern': return '#0000ff';           // Blue for E010-019
                case 'western_negative': return '#00ff00';  // Green for W coordinates
                default: return '#808080';                  // Gray fallback
            }
        }

        // Add rectangles for each zip file
        zipFiles.forEach(zipFile => {
            const bounds = [
                [zipFile.latStart, zipFile.lonStart],
                [zipFile.latEnd, zipFile.lonEnd]
            ];

            const rectangle = L.rectangle(bounds, {
                color: getBorderColor(zipFile.type),
                fillColor: getColor(zipFile.type),
                fillOpacity: 0.3,
                weight: 2
            }).addTo(map);

            // Add click event to download the zip file
            rectangle.on('click', function() {
                // Create download link and trigger download
                const link = document.createElement('a');
                link.href = '/agl/'+zipFile.name;
                link.download = zipFile.name;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Update info panel to show download initiated
                // document.getElementById('selected-info').innerHTML = `
                //     <strong>Downloading: ${zipFile.name}</strong><br>
                //     Coordinates: ${zipFile.latStart}°N-${zipFile.latEnd}°N, ${zipFile.lonStart}°E-${zipFile.lonEnd}°E<br>
                //     Type: ${zipFile.type} block<br>
                //     Area: ~111km × ~1110km
                // `;
            });

            // Add hover effects
            rectangle.on('mouseover', function() {
                this.setStyle({
                    weight: 3,
                    fillOpacity: 0.5
                });
            });

            rectangle.on('mouseout', function() {
                this.setStyle({
                    weight: 2,
                    fillOpacity: 0.3
                });
            });
        });

        // Add mouse move event to show coordinates
        map.on('mousemove', function(e) {
            const lat = e.latlng.lat.toFixed(3);
            const lon = e.latlng.lng.toFixed(3);
            document.getElementById('coords-info').innerHTML = `
                Mouse: ${lat}°N, ${lon}°E
            `;
        });

        // Add labels to rectangles for clarity
        zipFiles.forEach(zipFile => {
            const centerLat = (zipFile.latStart + zipFile.latEnd) / 2;
            const centerLon = (zipFile.lonStart + zipFile.lonEnd) / 2;
            
            L.marker([centerLat, centerLon], {
                icon: L.divIcon({
                    html: '&nbsp;', //  zipFile.name.replace('.zip', ''),
                    className: 'grid-label',
                    iconSize: [100, 20],
                    iconAnchor: [50, 10]
                })
            }).addTo(map);
        });

        // Fit map to show all rectangles
        const allBounds = L.latLngBounds([41, 0], [61, 20]);
        map.fitBounds(allBounds);

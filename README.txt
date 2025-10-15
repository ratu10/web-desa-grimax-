web-desa-grimax
---------------
Folder ready to upload/host.

Notes:
- Gallery uses Unsplash images (hotlinked). Replace with your own images by placing files in assets/img and updating script if desired.
- Map: To use Google Maps JS API, before the closing </body> add:
    <script>window.ADD_GOOGLE_MAPS = true; window.GMAPS_API_KEY = 'YOUR_API_KEY';</script>
  The page will then load the Google Maps API and display an interactive map. If not provided, OpenStreetMap iframe fallback will be used.
- To run locally: python -m http.server 8000  then open http://localhost:8000


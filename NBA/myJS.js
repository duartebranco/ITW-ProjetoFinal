// Select the button
$('.switch').click(function() {
    // Check if data-bs-theme attribute is 'dark'
    if ($('html').attr('data-bs-theme') === 'dark') {
        // If it is, remove the attribute
        $('html').removeAttr('data-bs-theme');
    } else {
        // If it's not, set the attribute to 'dark'
        $('html').attr('data-bs-theme', 'dark');
    }
});
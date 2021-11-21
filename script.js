let d = new Date();
        alert("Today's date is " + d);

    window.addEventListener('load', function() {
        document.querySelector('input[type="file"]').addEventListener('change', function() {
            if (this.files && this.files[0]) {
                var img = document.querySelector('img');
                img.onload = () => {
                    URL.revokeObjectURL(img.src);  // no longer needed, free memory
                }

                img.src = URL.createObjectURL(this.files[0]); // set src to blob url
                }
            });
    });
/*

function UpdateInfo()
{
  var teacher = document.getElementById('teacher').val();
  var grade = document.getElementById('grade').val();
  var info = teacher + '\'s '+ grade + ' class';
  document.getElementById('info').value = info;
}

 Solution 1 (onChange) 
<input id="teacher" type="text" onChange="UpdateInfo();" />
<input id="grade" type="text" onChange="UpdateInfo();" />
<input id="info" type="text" />


*/
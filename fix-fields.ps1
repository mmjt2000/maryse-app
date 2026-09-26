$PB_URL = "https://pocketbase-production-9622.up.railway.app"
$PB_EMAIL = "jeant.montreuil@gmail.com"
$PB_PASSWORD = "Jm103763$"

$auth = Invoke-RestMethod -Uri "$PB_URL/api/collections/_superusers/auth-with-password" -Method Post -Body (@{identity=$PB_EMAIL;password=$PB_PASSWORD} | ConvertTo-Json) -ContentType "application/json"
$headers = @{ "Authorization" = $auth.token; "Content-Type" = "application/json" }

function Fix-Collection($name, $fields) {
    Write-Host "Fix $name..." -ForegroundColor Yellow
    $body = @{ fields = $fields } | ConvertTo-Json -Depth 10
    try {
        Invoke-RestMethod -Uri "$PB_URL/api/collections/$name" -Method Patch -Body $body -Headers $headers | Out-Null
        Write-Host "  OK $name" -ForegroundColor Green
    } catch {
        Write-Host "  ERR $name : $_" -ForegroundColor Red
    }
}

$photoFields = @(
    @{name="title";type="text";required=$false;max=200},
    @{name="image";type="file";required=$false;maxSelect=1;maxSize=5242880;mimeTypes=@("image/jpeg","image/png","image/webp")}
)
Fix-Collection "photos_maryse" $photoFields
Fix-Collection "photos_laeticia" $photoFields

$diaryFields = @(
    @{name="title";type="text";required=$false;max=200},
    @{name="text";type="text";required=$false;max=5000},
    @{name="photo";type="file";required=$false;maxSelect=1;maxSize=5242880;mimeTypes=@("image/jpeg","image/png","image/webp")}
)
Fix-Collection "diary_maryse" $diaryFields
Fix-Collection "diary_laeticia" $diaryFields

$progressFields = @(
    @{name="xp";type="number";required=$false},
    @{name="level";type="number";required=$false},
    @{name="academy_level";type="number";required=$false},
    @{name="completed_lessons";type="json";required=$false;maxSize=10000},
    @{name="grammar_completed";type="json";required=$false;maxSize=10000},
    @{name="exam_completed";type="json";required=$false;maxSize=10000},
    @{name="dad_progress";type="json";required=$false;maxSize=20000}
)
Fix-Collection "progress_maryse" $progressFields
Fix-Collection "progress_laeticia" $progressFields

Write-Host "`nTERMINE" -ForegroundColor Cyan

; Modèle Inno Setup (https://jrsoftware.org/isinfo.php) -> installateur .exe
; À ADAPTER : SourceDir doit pointer vers le dossier de sortie réel du build Windows Release.
#define AppName "Devine le Mot"
#define AppExe "DevineLeMot.exe"
#define SourceDir "payload"

[Setup]
AppName={#AppName}
AppVersion=1.0.0
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
OutputDir=..\..\dist
OutputBaseFilename=DevineLeMot-Setup
Compression=lzma2
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64compatible

[Files]
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: recursesubdirs ignoreversion

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppExe}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExe}"

[Run]
Filename: "{app}\{#AppExe}"; Description: "Lancer {#AppName}"; Flags: nowait postinstall skipifsilent

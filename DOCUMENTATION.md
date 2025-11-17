# Dokumentation Testbed 3.1 #

Verona Player Testbed ist eine Offline-Anwendung zum Testen von Playern, Unit-Definitionen und/oder Widgets.

## How To: ##

Die fertige Stand-Alone-Anwendung kann als [Release](https://github.com/iqb-berlin/verona-player-testbed/releases) heruntergeladen werden.
Oder direkt [hier](https://iqb-berlin.github.io/verona-player-testbed/) aufgerufen werden.

### Laden der Testdateien ###

Auf der Startseite der Anwendung (jederzeit erreichbar über einen Klick auf das Logo links oben) muss zuerst ein Player ausgewählt werden.
Weiterhin muss eine oder mehrere Units geladen werden (hier ist Mehrfach-Auswahl im Datei-Dialog möglich). Die Liste der Units kann über das Papierkorb Symbol gelöscht werden.
Es erfolgt keine Überprüfung, ob die Unit-Definitionen zum Player passen. Der entsprechnde Test muss durch den Player selbst durchgeführt werden.
Beim Test von Widgets bzw. Nutzung von Widgets durch die Units, muss zusätzlich ein Widget hinzugefügt werden. (In einer zukünftigen Version des Testbed können mehrere unterschiedliche Widgets hinzugefügt werden, jedoch pro Type nur ein Widget)

### Start ###

Zum Starten des Tests kann die Navigation am oberen rechten Rand verwendet werden.
Alternativ kann auch eine Unit direkt durch Klick auf den entsprechenden Eintrag in der Unit-Liste gestartet werden.
Bei Units, die aus mehreren Unter-Seiten bestehen erscheint am unteren Rand eine zusätzliche Navigation.

### Überprüfung der Antworten ###

Zur Überprüfung der Antworten können Tabellen angezeigt werden, die die Antworten der Units bzw. Widgets auflisten. Dazu kann ein Modal-Fenster aufgerufen werden ('Antworten'-Button unten rechts) oder ein zusätzlicher Tab im Browser geöffnet werden (der externer Link Button rechts daneben).
Im externen Tab werden kontinuierlich die Antworten der Units/Widgets aktualisiert.
Ein Zurücksetzen der Antworten ist mir 'Alles Löschen' / 'Alle Antworten löschen' möglich.

Während des Test von Units werden am unteren Rand der vom Player übertragene presentation sowie responses Zustand angezeigt.

### Optionen ###

Über das Zahnrad-Symbol oben rechts lassen sich die Einstellungen anpassen.

Die obersten Einstellungen sind zur Konfiguration des Players relevant. Zur Anwendung der geänderten Konfiguration kann der Player neu gestartet werden oder per PlayerConfigChangedNotification sofort angewendet werden ('Player-Neustart' bzw. 'Sofort Anwenden' Buttons).

Das Dropdown 'LogLevel für Testbed' definiert, welche Meldungen des Testbeds in der Console angezeigt werden sollen und wie detailliert diese ausfallen.
In der Console wird bei LogLevel 'Info' bzw. 'Debug' sämtliche Kommunikation von Host zu Player/Widget und zurück in der Console angezeigt. Bei 'Debug' wird zusätzlich das vollständige Daten-Objekt ausgegeben.

Mit dem 'Widget starten'-Button kann ein Widget direkt auch ohne entsprechenden Player gestartet werden (aber ohne zusätzliche Parameter bzw. shared Parameter).










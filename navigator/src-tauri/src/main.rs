// Windows: kein zusätzliches Konsolenfenster im Release.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    fachwerker_navigator_lib::run()
}

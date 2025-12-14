use std::fs;
use std::path::Path;

use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct Aircraft {
    pub id: String,
    pub callsign: Option<String>,
    pub aircraft_type: Option<String>,
    pub club: String,
}

#[derive(Debug, Deserialize)]
struct AircraftList {
    aircraft: Vec<Aircraft>,
}

pub fn load_aircraft(path: &Path) -> Vec<Aircraft> {
    let content = fs::read_to_string(path)
        .unwrap_or_else(|e| panic!("Failed to read {}: {e}", path.display()));
    let list: AircraftList = toml::from_str(&content)
        .unwrap_or_else(|e| panic!("Failed to parse {}: {e}", path.display()));
    list.aircraft
}

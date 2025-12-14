use std::fs;

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

pub fn load_aircraft() -> Vec<Aircraft> {
    let content = fs::read_to_string("aircraft.toml").expect("Failed to read aircraft.toml");
    let list: AircraftList = toml::from_str(&content).expect("Failed to parse aircraft.toml");
    list.aircraft
}

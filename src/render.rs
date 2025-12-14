use minijinja::{Environment, context};
use serde::Serialize;
use thiserror::Error;

const TEMPLATE: &str = include_str!("../templates/index.html.jinja");

#[derive(Debug, Clone, Serialize)]
pub struct AircraftStatus {
    pub callsign: String,
    pub aircraft_type: String,
    pub status: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct ClubStatus {
    pub name: String,
    pub aircraft: Vec<AircraftStatus>,
}

#[derive(Debug, Error)]
pub enum RenderError {
    #[error("Template error: {0}")]
    Template(#[from] minijinja::Error),
}

pub fn render_html(clubs: &[ClubStatus]) -> Result<String, RenderError> {
    let mut env = Environment::new();
    env.add_template("index.html", TEMPLATE)?;

    let template = env.get_template("index.html")?;
    let html = template.render(context! {
        clubs => clubs,
    })?;

    Ok(html)
}

#[cfg(test)]
mod tests {
    use super::*;
    use insta::assert_snapshot;

    #[test]
    fn test_render_html() {
        let clubs = vec![
            ClubStatus {
                name: "LVA".to_string(),
                aircraft: vec![
                    AircraftStatus {
                        callsign: "D-3886".to_string(),
                        aircraft_type: "Astir".to_string(),
                        status: "airworthy".to_string(),
                    },
                    AircraftStatus {
                        callsign: "D-1108".to_string(),
                        aircraft_type: "LS 4".to_string(),
                        status: "grounded".to_string(),
                    },
                ],
            },
            ClubStatus {
                name: "Nordstern".to_string(),
                aircraft: vec![AircraftStatus {
                    callsign: "D-5074".to_string(),
                    aircraft_type: "ASK 21".to_string(),
                    status: "prewarning".to_string(),
                }],
            },
        ];

        let html = render_html(&clubs).unwrap();
        assert_snapshot!(html);
    }
}

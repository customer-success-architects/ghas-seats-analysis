# GHAS Seat Age Analysis
This script analyzes the GHAS License file available in StaffTools to calculate the 'age' (days since last commit) of each GHAS Active Commitor. The license file contains the last commit for each user, for each organization in an enterprise. This script consolidates activity by user across organizations into a single 'last commit', and generates a visualization for that data.

## Getting Started
1. Clone this repository and install dependencies with `npm i`
2. Download GHAS license `.csv` from StaffTools and (optionally) put it in `/data`
4. Run the script with `npm start <PATH TO YOUR LICENSE FILE>`- i.e., `npm start ./data/example.csv`
5. The results will be saved to `./results/pushes-by-date.csv`. Copy the results to your clipboard.
6. Open [the Google Sheet](https://docs.google.com/spreadsheets/d/1NbVSwkmyZy9T7TRx-zxmu0-5jAGBjlFw67yVNHkOJ5o/edit?usp=sharing) and paste the contents into cell A1.
7. With Column A selected, go to `Data -> Split text to columns` to parse the CSV.
8. The Chart should update to reflect your customer's license age distribution.

## Notes
This script also generates a chart SVG at `./results/chart.svg` that has the same data as what is generated in the Google Sheet, but is missing labels. Future work, contributions would be awesome!

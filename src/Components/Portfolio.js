import React, { Component } from 'react';
import Carousel from "react-multi-carousel";
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, CardHeader } from '@material-ui/core'
import "react-multi-carousel/lib/styles.css";
import '../Styles/portfolio.scss';


class Portfolio extends Component {
  styles = 
    {
      card: {
        maxWidth: 280,
        height: 380,
        margin: 10,
        border: 'solid grey 1px',
        backgroundColor: ''
      },
      media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
      }
    };
  responsive = {
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
      }
    };
  render() {
    if (this.props.data) {
      var projectsCarousel =  (
      <Carousel
        responsive={this.responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={50000}
        renderDotsOutside={true}
        swipeable={true}
        showDots={true}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        deviceType={this.props.deviceType}
        itemClass="carousel-item-padding-40-px"
        containerClass="carousel-container" >
        {
            this.props.data.projects.map( (project, index) => 
            <div key={index}>
                  <Card style={this.styles.card}>
                      <CardActionArea color="primary" variant="contained">
                            <CardHeader title={project.title}>
                            </CardHeader>
                            <CardMedia
                              style={this.styles.media}
                              image={"images/portfolio/"+ project.image}
                              title="Projects"
                            />
                            <CardContent>
                                  <Typography variant="h6" color="textSecondary" component="p">
                                    {project.category}
                                  </Typography>
                            </CardContent>
                      </CardActionArea>
                      <CardActions>
                            <Button size="medium" color="primary" variant="contained">
                              Share
                            </Button>
                            <Button size="medium" color="primary" variant="contained" href={project.url} target="_blank">
                              Learn More
                            </Button>
                      </CardActions>
                </Card>
            </div>
        )
        }
    </Carousel>)
    }

    return (
      <section id="portfolio">
        <div className="row">
          <div className="twelve columns collapsed">

              <h1>Check Out Some of My Works.</h1>

              <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
                  {projectsCarousel}
            </div>
          </div>
      </div>
   </section>
    );
  }
}

export default Portfolio;

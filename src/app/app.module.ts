import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DataVisualizationComponent } from './data-visualization/data-visualization.component';
import { DataVisualizationItemComponent } from './data-visualization/data-visualization-item/data-visualization-item.component';

@NgModule({
  declarations: [AppComponent, DataVisualizationComponent, DataVisualizationItemComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
